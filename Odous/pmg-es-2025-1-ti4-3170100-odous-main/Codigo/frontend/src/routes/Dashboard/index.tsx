import React, { useState } from "react";
import {
  DashboardContainer,
  CardsGrid,
  CustomDateRange,
  FiltersRow,
  ChartsGrid,
} from "./styles";
import Filter from "../../components/Filter";
import PageTitle from "../../components/PageTitle";
import { Selector } from "../../components/Selector";
import { getDateRange } from "../../utils/getDateRange";
import { Button, TextField } from "@mui/material";
// Ícones do Lucide
import {
  PackageCheck,
  Warehouse,
  PackagePlus,
  AlertTriangle,
  CalendarCheck,
  Layers,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import DashboardCard from "../../components/DashboardCard/DashboardCard";

import useMaterialDashboardData from "../../hooks/useMaterialDashboardData";
import useSemifinishedDashboardData from "../../hooks/useSemifinishedDashboardData";
import useFinishedDashboardData from "../../hooks/useFinishedDashboardData";

import MaterialEvolutionChart from "../../components/DashboardCard/MaterialEvolutionChart";
import LowStockAlerts from "../../components/DashboardCard/LowStockAlerts";
import MaterialRankingBar from "../../components/DashboardCard/MaterialRankingBar";
import ComparativoAdquiridoDisponivel from "../../components/DashboardCard/ComparativoAdquiridoDisponivel";

import SemiEvolutionChart from "../../components/DashboardCard/SemiEvolutionChart";
import SemiRankingMaisProduzidos from "../../components/DashboardCard/SemiRankingMaisProduzidos";
import SemiComparativoProduzidoDisponivel from "../../components/DashboardCard/SemiComparativoProduzidoDisponivel";

import FinishedEvolutionChart from "../../components/DashboardCard/FinishedEvolutionChart";
import FinishedRankingMaisProduzidos from "../../components/DashboardCard/FinishedRankingMaisProduzidos";
import FinishedComparativoProduzidoDisponivel from "../../components/DashboardCard/FinishedComparativoProduzidoDisponivel";

import dayjs from "dayjs";

const Dashboard: React.FC = () => {
  console.log("Hoje do sistema:", dayjs().format("YYYY-MM-DD"));

  const [period, setPeriod] = useState("Últimos 7 dias");
  // Para o filtro personalizado:
  const [customStartInput, setCustomStartInput] = useState("");
  const [customEndInput, setCustomEndInput] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  // Sempre chame o utilitário com os estados “aplicados”:
  const { startDate, endDate } = getDateRange(period, customStart, customEnd);
  console.log("Range filtro:", startDate, endDate);

  const [selectedCategory, setSelectedCategory] = useState("all");
  console.log(startDate, endDate);
  
  const {
    kpis,
    loading,
    evolutionByDate,
    lowStockAlerts,
    rankingMaisAdquiridos,
    comparativoAdquiridoDisponivel,
  } = useMaterialDashboardData({ startDate, endDate });

  const {
    kpis: semiKpis,
    loading: semiLoading,
    evolutionByDate: semiEvolutionByDate,
    rankingMaisProduzidos: semiRankingMaisProduzidos,
    comparativoProduzidoDisponivel: semiComparativoProduzidoDisponivel,
    lowStockAlerts: semiLowStockAlerts,
  } = useSemifinishedDashboardData({ startDate, endDate });
  
  const {
    kpis: finishedKpis,
    loading: finishedLoading,
    evolutionByDate: finishedEvolutionByDate,
    rankingMaisProduzidos: finishedRankingMaisProduzidos,
    comparativoProduzidoDisponivel: finishedComparativoProduzidoDisponivel,
    lowStockAlerts: finishedLowStockAlerts,
  } = useFinishedDashboardData({ startDate, endDate });  

  const categoryOptions = [
    { label: "Todos", value: "all" },
    { label: "Materiais", value: "materials" },
    { label: "Semiacabados", value: "semi" },
    { label: "Acabados", value: "finished" },
  ];

  const showCustomRange = period === "Personalizado";


  return (
    <DashboardContainer>
      <PageTitle title="Dashboard" />

      <FiltersRow>
        <Filter
          filters={[
            "Últimos 7 dias",
            "Últimos 30 dias",
            "Mês atual",
            "Personalizado",
          ]}
          onFilterChange={setPeriod}
        />

        <Selector
          options={categoryOptions}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          defaultText="Selecione a categoria"
        />
      </FiltersRow>

      {showCustomRange && (
        <CustomDateRange>
          <TextField
            type="date"
            label="Data início"
            InputLabelProps={{ shrink: true }}
            value={customStartInput}
            onChange={(e) => setCustomStartInput(e.target.value)}
            sx={{
              backgroundColor: "var(--input-background)",
              input: {
                color: "var(--input-text)",
              },
              label: {
                color: "var(--input-text)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--input-border)",
              },
            }}
          />
          <TextField
            type="date"
            label="Data fim"
            InputLabelProps={{ shrink: true }}
            value={customEndInput}
            onChange={(e) => setCustomEndInput(e.target.value)}
            sx={{
              backgroundColor: "var(--input-background)",
              input: {
                color: "var(--input-text)",
              },
              label: {
                color: "var(--input-text)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--input-border)",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              setCustomStart(customStartInput);
              setCustomEnd(customEndInput);
            }}
            disabled={!customStartInput || !customEndInput}
            sx={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            OK
          </Button>
        </CustomDateRange>
      )}

      {(selectedCategory === "all" || selectedCategory === "materials") && (
        <>
          <h2 style={{ fontFamily: "Roboto", marginTop: "2rem" }}>Materiais</h2>
          <CardsGrid>
            <DashboardCard
              icon={<PackageCheck />}
              title="Lotes cadastrados"
              value={kpis.totalLotes}
              loading={loading}
            />
            <DashboardCard
              icon={<PackagePlus />}
              title="Material adquirido (total)"
              value={kpis.totalAdquirido}
              loading={loading}
            />
            <DashboardCard
              icon={<Warehouse />}
              title="Material disponível"
              value={kpis.totalDisponivel}
              loading={loading}
            />
            <DashboardCard
              icon={<Layers />}
              title="Materiais diferentes"
              value={kpis.diferentesMateriais}
              loading={loading}
            />
            <DashboardCard
              icon={<AlertTriangle />}
              title="Estoque crítico"
              value={kpis.estoqueCritico}
              loading={loading}
            />
            <DashboardCard
              icon={<CalendarCheck />}
              title="Última aquisição"
              value={kpis.ultimaAquisicaoStr}
              loading={loading}
            />
          </CardsGrid>
          <ChartsGrid>
            <MaterialEvolutionChart data={evolutionByDate} loading={loading} />
            <MaterialRankingBar
              data={rankingMaisAdquiridos}
              loading={loading}
            />
            <ComparativoAdquiridoDisponivel
              data={comparativoAdquiridoDisponivel}
              loading={loading}
            />
          </ChartsGrid>
          <LowStockAlerts items={lowStockAlerts} />
        </>
      )}

      {(selectedCategory === "all" || selectedCategory === "semi") && (
        <>
          <h2 style={{ fontFamily: "Roboto", marginTop: "2rem" }}>
            Semiacabados
          </h2>
          <CardsGrid>
            <DashboardCard
              icon={<PackageCheck />}
              title="Lotes de Semiacabados"
              value={semiKpis.totalLotes}
              loading={semiLoading}
            />
            <DashboardCard
              icon={<CheckCircle />}
              title="Produzido OK"
              value={semiKpis.totalProduzidoOK}
              loading={semiLoading}
            />
            <DashboardCard
              icon={<AlertCircle />}
              title="Produzido NG"
              value={semiKpis.totalProduzidoNG}
              loading={semiLoading}
            />
            <DashboardCard
              icon={<Warehouse />}
              title="Total Disponível"
              value={semiKpis.totalDisponivel}
              loading={semiLoading}
            />
            <DashboardCard
              icon={<AlertTriangle />}
              title="Estoque Crítico"
              value={semiKpis.estoqueCritico}
              loading={semiLoading}
            />
            <DashboardCard
              icon={<CalendarCheck />}
              title="Última Produção"
              value={semiKpis.ultimaProducaoStr}
              loading={semiLoading}
            />
          </CardsGrid>
          <ChartsGrid>
            <SemiEvolutionChart
              data={semiEvolutionByDate}
              loading={semiLoading}
            />

            <SemiRankingMaisProduzidos
              data={semiRankingMaisProduzidos}
              loading={semiLoading}
            />

            <SemiComparativoProduzidoDisponivel
              data={semiComparativoProduzidoDisponivel}
              loading={semiLoading}
            />
          </ChartsGrid>
          <LowStockAlerts items={semiLowStockAlerts} />
        </>
      )}

      {(selectedCategory === "all" || selectedCategory === "finished") && (
        <>
          <h2 style={{ fontFamily: "Roboto", marginTop: "2rem" }}>Acabados</h2>
          <CardsGrid>
            <DashboardCard
              icon={<PackageCheck />}
              title="Lotes de Acabados"
              value={finishedKpis.totalLotes}
              loading={finishedLoading}
            />
            <DashboardCard
              icon={<CheckCircle />}
              title="Produzido OK"
              value={finishedKpis.totalProduzidoOK}
              loading={finishedLoading}
            />
            <DashboardCard
              icon={<AlertCircle />}
              title="Produzido NG"
              value={finishedKpis.totalProduzidoNG}
              loading={finishedLoading}
            />
            <DashboardCard
              icon={<Warehouse />}
              title="Total Disponível"
              value={finishedKpis.totalDisponivel}
              loading={finishedLoading}
            />
            <DashboardCard
              icon={<AlertTriangle />}
              title="Estoque Crítico"
              value={finishedKpis.estoqueCritico}
              loading={finishedLoading}
            />
            <DashboardCard
              icon={<CalendarCheck />}
              title="Última Produção"
              value={finishedKpis.ultimaProducaoStr}
              loading={finishedLoading}
            />
          </CardsGrid>
          <ChartsGrid>
            <FinishedEvolutionChart
              data={finishedEvolutionByDate}
              loading={finishedLoading}
            />

            <FinishedRankingMaisProduzidos
              data={finishedRankingMaisProduzidos}
              loading={finishedLoading}
            />

            <FinishedComparativoProduzidoDisponivel
              data={finishedComparativoProduzidoDisponivel}
              loading={finishedLoading}
            />
          </ChartsGrid>
          <LowStockAlerts items={finishedLowStockAlerts} />
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;