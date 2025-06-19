import { useMemo } from "react";
import OdousApi from "../services/apis/odous-api/odous-api.ts";
import { MaterialLotResponseDTO } from "../services/apis/odous-api/material-lots/dtos.ts";
import dayjs from "dayjs";

export type MaterialLot = MaterialLotResponseDTO & {
  materialName: string;
};

type Filters = {
  startDate?: string;
  endDate?: string;
  materialId?: string;
  onlyAvailable?: boolean;
};

export default function useMaterialDashboardData(filters: Filters) {
  // Instância da API
  const odousApi = useMemo(() => new OdousApi(), []);

  // Chamada real
  const { data: allLots = [], isLoading } = odousApi.materialLots.get({});

  // Filtro por período, material, disponível
  const filteredLots = useMemo(() => {
    return allLots
      .filter((lot) => {
        // Filtro por data (createdAt)
        const lotDateStr = dayjs(lot.createdAt).format("YYYY-MM-DD");
        //const lotDate = new Date(lot.createdAt);
        if (filters.startDate && lotDateStr < filters.startDate) return false;
        if (filters.endDate && lotDateStr > filters.endDate) return false;
        // Filtro por material
        if (
          filters.materialId &&
          String(lot.material?.id) !== String(filters.materialId)
        )
          return false;
        // Filtro só disponíveis
        if (filters.onlyAvailable && (lot.availableQuantity ?? 0) <= 0)
          return false;
        return true;
      })
      .map((lot) => ({
        ...lot,
        materialName: lot.material?.name || "",
      }));
  }, [
    allLots,
    filters.startDate,
    filters.endDate,
    filters.materialId,
    filters.onlyAvailable,
  ]);

  // KPIs
  const kpis = useMemo(() => {
    // Quantidade de lotes
    const totalLotes = filteredLots.length;

    // Soma do total adquirido
    const totalAdquirido = filteredLots.reduce(
      (sum, lot) => sum + (lot.acquiredQuantity ?? 0),
      0
    );

    // Soma do total disponível
    const totalDisponivel = filteredLots.reduce(
      (sum, lot) => sum + (lot.availableQuantity ?? 0),
      0
    );

    // Quantidade de materiais diferentes
    const diferentesMateriais = new Set(
      filteredLots.map((lot) => lot.material?.id)
    ).size;

    // Materiais com estoque crítico (≤ 10 unidades)
    const estoqueCriticoQtd = Object.values(
      filteredLots.reduce((acc, lot) => {
        if (!lot.material?.id) return acc;
        const id = lot.material.id;
        if (!acc[id]) acc[id] = { name: lot.material.name, qty: 0 };
        acc[id].qty += lot.availableQuantity ?? 0;
        return acc;
      }, {} as Record<string, { name: string; qty: number }>)
    ).filter((item) => item.qty <= 10).length;    

    // Data da última aquisição
    const ultimaAquisicao = filteredLots.length
      ? filteredLots.reduce(
          (latest, lot) => (lot.createdAt > latest ? lot.createdAt : latest),
          filteredLots[0].createdAt
        )
      : null;

    // Formatando a data da última aquisição para exibir
    const ultimaAquisicaoStr = ultimaAquisicao
      ? ultimaAquisicao instanceof Date
        ? ultimaAquisicao.toLocaleDateString()
        : new Date(ultimaAquisicao).toLocaleDateString()
      : "—";

    return {
      totalLotes,
      totalAdquirido,
      totalDisponivel,
      diferentesMateriais,
      estoqueCritico: estoqueCriticoQtd,
      ultimaAquisicaoStr,
    };
  }, [filteredLots]);

  // Gráfico evolução
  const evolutionByDate = useMemo(() => {
    const result: { date: string; Adquirido: number }[] = [];
    filteredLots.forEach((lot) => {
      const dateString =
        lot.createdAt instanceof Date
          ? lot.createdAt.toLocaleDateString("pt-BR")
          : new Date(lot.createdAt).toLocaleDateString("pt-BR");
      const idx = result.findIndex((r) => r.date === dateString);
      if (idx >= 0) result[idx].Adquirido += lot.acquiredQuantity;
      else result.push({ date: dateString, Adquirido: lot.acquiredQuantity });
    });
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredLots]);

  // Ranking dos materiais mais adquiridos
  const rankingMaisAdquiridos = useMemo(() => {
    const acc: { [materialName: string]: number } = {};
    filteredLots.forEach((lot) => {
      const name = lot.material?.name || "N/A";
      acc[name] = (acc[name] || 0) + lot.acquiredQuantity;
    });
    return Object.entries(acc)
      .map(([materialName, total]) => ({ materialName, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5
  }, [filteredLots]);

  //Comparativo Adquirido vs Disponível por Material
  const comparativoAdquiridoDisponivel = useMemo(() => {
    const acc: {
      [materialName: string]: { adquirido: number; disponivel: number };
    } = {};
    filteredLots.forEach((lot) => {
      const name = lot.material?.name || "N/A";
      if (!acc[name]) acc[name] = { adquirido: 0, disponivel: 0 };
      acc[name].adquirido += lot.acquiredQuantity ?? 0;
      acc[name].disponivel += lot.availableQuantity ?? 0;
    });
    return Object.entries(acc).map(([materialName, valores]) => ({
      materialName,
      ...valores,
    }));
  }, [filteredLots]);      

  // Alertas de baixo estoque
  const lowStockAlerts = useMemo(() => {
    // Materiais com disponível <= 10
    const byMaterial: { [materialId: string]: { name: string; qty: number } } =
      {};
    filteredLots.forEach((lot) => {
      if (!lot.material?.id) return;
      const id = lot.material.id;
      if (!byMaterial[id]) {
        byMaterial[id] = { name: lot.material.name, qty: 0 };
      }
      byMaterial[id].qty += lot.availableQuantity ?? 0;
    });
    return Object.values(byMaterial).filter((item) => item.qty <= 10);
  }, [filteredLots]);

  // Exporte todos os dados necessários para dashboard
  return {
    materialLots: filteredLots,
    kpis,
    loading: isLoading,
    evolutionByDate,
    rankingMaisAdquiridos,
    comparativoAdquiridoDisponivel,
    lowStockAlerts,
  };
}