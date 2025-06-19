import { useMemo } from "react";
import OdousApi from "../services/apis/odous-api/odous-api.ts"; // ajuste o import conforme seu projeto
import { SemifinishedLotResponseDTO } from "../services/apis/odous-api/semifinished-lots/dtos.ts"; // ajuste o import
import dayjs from "dayjs";

// Tipagem básica do semifinished lot, ajuste se necessário
export type SemifinishedLot = SemifinishedLotResponseDTO & {
  semifinishedName: string;
};

type Filters = {
  startDate?: string;
  endDate?: string;
  semifinishedId?: string;
  onlyAvailable?: boolean;
};

export default function useSemifinishedDashboardData(filters: Filters) {
  // Instancie sua API/service
  const odousApi = useMemo(() => new OdousApi(), []);

  // Chame o endpoint de lotes de semiacabados
  const { data: allLots = [], isLoading } = odousApi.semifinishedLots.get({});

  // Filtragem dos lotes de acordo com os filtros aplicados
  const filteredLots = useMemo(() => {
    return allLots
      .filter((lot) => {
        const lotDateStr = dayjs(lot.endDate).format("YYYY-MM-DD");

        if (filters.startDate && lotDateStr < filters.startDate) return false;
        if (filters.endDate && lotDateStr > filters.endDate) return false;

        if (
          filters.semifinishedId &&
          String(lot.semifinished?.id) !== String(filters.semifinishedId)
        )
          return false;

        if (filters.onlyAvailable && (lot.availableQuantity ?? 0) <= 0)
          return false;

        return true;
      })
      .map((lot) => ({
        ...lot,
        semifinishedName: lot.semifinished?.name || "",
      }));
  }, [
    allLots,
    filters.startDate,
    filters.endDate,
    filters.semifinishedId,
    filters.onlyAvailable,
  ]);
  

  // KPIs principais
  const kpis = useMemo(() => {
    // Estoque crítico
    const estoqueCriticoQtd = Object.values(
      filteredLots.reduce((acc, lot) => {
        if (!lot.semifinished?.id) return acc;
        const id = lot.semifinished.id;
        if (!acc[id]) acc[id] = { name: lot.semifinished.name, qty: 0 };
        acc[id].qty += lot.availableQuantity ?? 0;
        return acc;
      }, {} as Record<string, { name: string; qty: number }>)
    ).filter((item) => item.qty <= 5).length; // Limite crítico: <= 5

    // Última produção
    const ultimaProducao = filteredLots.length
      ? filteredLots.reduce(
          (latest, lot) =>
            lot.endDate && lot.endDate > latest ? lot.endDate : latest,
          filteredLots[0].endDate ?? ""
        )
      : null;

    const ultimaProducaoStr = ultimaProducao
      ? ultimaProducao instanceof Date
        ? ultimaProducao.toLocaleDateString()
        : new Date(ultimaProducao).toLocaleDateString()
      : "—";

    return {
      totalLotes: filteredLots.length,
      totalProduzidoOK: filteredLots.reduce(
        (sum, lot) => sum + (lot.producedQuantityOK ?? 0),
        0
      ),
      totalProduzidoNG: filteredLots.reduce(
        (sum, lot) => sum + (lot.producedQuantityNG ?? 0),
        0
      ),
      totalDisponivel: filteredLots.reduce(
        (sum, lot) => sum + (lot.availableQuantity ?? 0),
        0
      ),
      estoqueCritico: estoqueCriticoQtd,
      ultimaProducaoStr,
    };
  }, [filteredLots]);

  // Gráfico de evolução de produção por data
  const evolutionByDate = useMemo(() => {
    const result: { date: string; ok: number; ng: number }[] = [];
    filteredLots.forEach((lot) => {
      const dateString = lot.endDate
        ? lot.endDate instanceof Date
          ? lot.endDate.toLocaleDateString("pt-BR")
          : new Date(lot.endDate).toLocaleDateString("pt-BR")
        : "";
      const idx = result.findIndex((r) => r.date === dateString);
      if (idx >= 0) {
        result[idx].ok += lot.producedQuantityOK ?? 0;
        result[idx].ng += lot.producedQuantityNG ?? 0;
      } else {
        result.push({
          date: dateString,
          ok: lot.producedQuantityOK ?? 0,
          ng: lot.producedQuantityNG ?? 0,
        });
      }
    });
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredLots]);

  // Ranking dos semiacabados mais produzidos
  const rankingMaisProduzidos = useMemo(() => {
    const acc: { [semifinishedName: string]: { ok: number; ng: number } } = {};
    filteredLots.forEach((lot) => {
      const name = lot.semifinishedName;
      if (!acc[name]) acc[name] = { ok: 0, ng: 0 };
      acc[name].ok += lot.producedQuantityOK ?? 0;
      acc[name].ng += lot.producedQuantityNG ?? 0;
    });
    return Object.entries(acc)
      .map(([semifinishedName, valores]) => ({ semifinishedName, ...valores }))
      .sort((a, b) => b.ok - a.ok)
      .slice(0, 5);
  }, [filteredLots]);

  // Comparativo produzido vs disponível por semiacabado
  const comparativoProduzidoDisponivel = useMemo(() => {
    const acc: {
      [semifinishedName: string]: { ok: number; disponivel: number };
    } = {};
    filteredLots.forEach((lot) => {
      const name = lot.semifinishedName;
      if (!acc[name]) acc[name] = { ok: 0, disponivel: 0 };
      acc[name].ok += lot.producedQuantityOK ?? 0;
      acc[name].disponivel += lot.availableQuantity ?? 0;
    });
    return Object.entries(acc).map(([semifinishedName, valores]) => ({
      semifinishedName,
      ...valores,
    }));
  }, [filteredLots]);

  // taxa de rejeição por lote ou por tipo de semiacabado
  const percentualPerda = useMemo(() => {
    const acc: { [semifinishedName: string]: { ok: number; ng: number } } = {};
    filteredLots.forEach((lot) => {
      const name = lot.semifinishedName;
      if (!acc[name]) acc[name] = { ok: 0, ng: 0 };
      acc[name].ok += lot.producedQuantityOK ?? 0;
      acc[name].ng += lot.producedQuantityNG ?? 0;
    });
    return Object.entries(acc)
      .map(([semifinishedName, { ok, ng }]) => ({
        semifinishedName,
        perda: ok + ng > 0 ? (ng / (ok + ng)) * 100 : 0,
      }))
      .sort((a, b) => b.perda - a.perda);
  }, [filteredLots]);

  // Alertas de baixo estoque
  const lowStockAlerts = useMemo(() => {
    const bySemi: { [semifinishedId: string]: { name: string; qty: number } } =
      {};
    filteredLots.forEach((lot) => {
      if (!lot.semifinished?.id) return;
      const id = lot.semifinished.id;
      if (!bySemi[id]) {
        bySemi[id] = { name: lot.semifinished.name, qty: 0 };
      }
      bySemi[id].qty += lot.availableQuantity ?? 0;
    });
    return Object.values(bySemi).filter((item) => item.qty <= 5); // Limite crítico ajustável
  }, [filteredLots]);

  // Exporte tudo o que a dash precisa
  return {
    semifinishedLots: filteredLots,
    kpis,
    loading: isLoading,
    evolutionByDate,
    rankingMaisProduzidos,
      comparativoProduzidoDisponivel,
      percentualPerda,
    lowStockAlerts,
  };
}
