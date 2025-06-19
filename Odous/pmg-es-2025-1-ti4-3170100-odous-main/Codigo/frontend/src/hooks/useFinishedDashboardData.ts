import { useMemo } from "react";
import OdousApi from "../services/apis/odous-api/odous-api.ts";
import { FinishedLotResponseDTO } from "../services/apis/odous-api/finished-lots/dtos.ts";
import dayjs from "dayjs";

// Tipagem básica do FinishedLot
export type FinishedLot = FinishedLotResponseDTO & {
  finishedName: string;
};

type Filters = {
  startDate?: string;
  endDate?: string;
  finishedId?: string;
  onlyAvailable?: boolean;
};

export default function useFinishedDashboardData(filters: Filters) {
  const odousApi = useMemo(() => new OdousApi(), []);

  const { data: allLots = [], isLoading } = odousApi.finishedLots.get({});

  // Filtro por período, finishedId, disponibilidade
  const filteredLots = useMemo(() => {
    return allLots
      .filter((lot) => {
        const lotDateStr = dayjs(lot.endDate).format("YYYY-MM-DD");

        if (filters.startDate && lotDateStr < filters.startDate) return false;
        if (filters.endDate && lotDateStr > filters.endDate) return false;

        if (
          filters.finishedId &&
          String(lot.finished?.id) !== String(filters.finishedId)
        )
          return false;

        if (filters.onlyAvailable && (lot.availableQuantity ?? 0) <= 0)
          return false;

        return true;
      })
      .map((lot) => ({
        ...lot,
        finishedName: lot.finished?.name || "",
      }));
  }, [
    allLots,
    filters.startDate,
    filters.endDate,
    filters.finishedId,
    filters.onlyAvailable,
  ]);

  // KPIs
  const kpis = useMemo(() => {
    const totalLotes = filteredLots.length;
    const totalProduzidoOK = filteredLots.reduce(
      (sum, lot) => sum + (lot.producedQuantityOK ?? 0),
      0
    );
    const totalProduzidoNG = filteredLots.reduce(
      (sum, lot) => sum + (lot.producedQuantityNG ?? 0),
      0
    );
    const totalDisponivel = filteredLots.reduce(
      (sum, lot) => sum + (lot.availableQuantity ?? 0),
      0
    );

    const estoqueCriticoQtd = Object.values(
      filteredLots.reduce((acc, lot) => {
        if (!lot.finished?.id) return acc;
        const id = lot.finished.id;
        if (!acc[id]) acc[id] = { name: lot.finished.name, qty: 0 };
        acc[id].qty += lot.availableQuantity ?? 0;
        return acc;
      }, {} as Record<string, { name: string; qty: number }>)
    ).filter((item) => item.qty <= 5).length;

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
      totalLotes,
      totalProduzidoOK,
      totalProduzidoNG,
      totalDisponivel,
      estoqueCritico: estoqueCriticoQtd,
      ultimaProducaoStr,
    };
  }, [filteredLots]);

  // Evolução por data
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

  // Ranking mais produzidos
  const rankingMaisProduzidos = useMemo(() => {
    const acc: { [finishedName: string]: { ok: number; ng: number } } = {};

    filteredLots.forEach((lot) => {
      const name = lot.finishedName;
      if (!acc[name]) acc[name] = { ok: 0, ng: 0 };
      acc[name].ok += lot.producedQuantityOK ?? 0;
      acc[name].ng += lot.producedQuantityNG ?? 0;
    });

    return Object.entries(acc)
      .map(([finishedName, valores]) => ({ finishedName, ...valores }))
      .sort((a, b) => b.ok - a.ok)
      .slice(0, 5);
  }, [filteredLots]);

  // Comparativo Produzido x Disponível
  const comparativoProduzidoDisponivel = useMemo(() => {
    const acc: {
      [finishedName: string]: { ok: number; disponivel: number };
    } = {};

    filteredLots.forEach((lot) => {
      const name = lot.finishedName;
      if (!acc[name]) acc[name] = { ok: 0, disponivel: 0 };
      acc[name].ok += lot.producedQuantityOK ?? 0;
      acc[name].disponivel += lot.availableQuantity ?? 0;
    });

    return Object.entries(acc).map(([finishedName, valores]) => ({
      finishedName,
      ...valores,
    }));
  }, [filteredLots]);

  // Percentual de Perda
  const percentualPerda = useMemo(() => {
    const acc: { [finishedName: string]: { ok: number; ng: number } } = {};

    filteredLots.forEach((lot) => {
      const name = lot.finishedName;
      if (!acc[name]) acc[name] = { ok: 0, ng: 0 };
      acc[name].ok += lot.producedQuantityOK ?? 0;
      acc[name].ng += lot.producedQuantityNG ?? 0;
    });

    return Object.entries(acc)
      .map(([finishedName, { ok, ng }]) => ({
        finishedName,
        perda: ok + ng > 0 ? (ng / (ok + ng)) * 100 : 0,
      }))
      .sort((a, b) => b.perda - a.perda);
  }, [filteredLots]);

  // Low Stock Alerts
  const lowStockAlerts = useMemo(() => {
    const byFinished: { [finishedId: string]: { name: string; qty: number } } =
      {};

    filteredLots.forEach((lot) => {
      if (!lot.finished?.id) return;
      const id = lot.finished.id;
      if (!byFinished[id]) {
        byFinished[id] = { name: lot.finished.name, qty: 0 };
      }
      byFinished[id].qty += lot.availableQuantity ?? 0;
    });

    return Object.values(byFinished).filter((item) => item.qty <= 5);
  }, [filteredLots]);

  return {
    finishedLots: filteredLots,
    kpis,
    loading: isLoading,
    evolutionByDate,
    rankingMaisProduzidos,
    comparativoProduzidoDisponivel,
    percentualPerda,
    lowStockAlerts,
  };
}
