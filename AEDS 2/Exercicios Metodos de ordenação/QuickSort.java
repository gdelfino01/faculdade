import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Stream;

class Medalhista implements Comparable<Medalhista> {

    private static final int MAX_MEDALHAS = 8;
    private String name;
    private String gender;
    private LocalDate birthDate;
    private String country;
    private Medalha[] medals = new Medalha[MAX_MEDALHAS];
    private int medalCount = 0;
    private int goldMedal = 0;
    private int silverMedal = 0;
    private int bronzeMedal = 0;

    public Medalhista(String nome, String genero, String nascimento, String pais) {
        name = nome;
        gender = genero;
        birthDate = LocalDate.parse(nascimento);
        country = pais;
    }

    public void setMedals(Medalha[] medals) {
        this.medals = medals;
    }

    public void incluirMedalha(Medalha medalha) {
        medals[medalCount] = medalha;
        medalCount++;
        if (medalha.getTipo() == TipoMedalha.OURO) {
            goldMedal++;
        } else if (medalha.getTipo() == TipoMedalha.PRATA) {
            silverMedal++;
        } else if (medalha.getTipo() == TipoMedalha.BRONZE) {
            bronzeMedal++;
        }
    }

    public String getCountry() {
        return country;
    }

    public int totalMedalhas() {

        return medalCount;
    }

    public StringBuilder relatorioDeMedalhas(TipoMedalha tipo) {
        StringBuilder relatorio = new StringBuilder();
        int cont = 0;

        for (Medalha medal : medals) {
            if (medal != null && medal.getTipo().equals(tipo)) {
                relatorio.append(medal).append("\n");
                cont++;
            }
        }

        if (cont == 0) {
            System.out.println("Nao possui medalha de " + tipo);
        }
        return relatorio;
    }

    public String getPais() {
        return country;
    }

    public String getNascimento() {
        return DateTimeFormatter.ofPattern("dd/MM/yyyy").format(birthDate);
    }

    public String getGender() {
        return gender;
    }

    public String getName() {
        return name;
    }

    public Medalha[] getMedals() {
        return medals;
    }

    @Override
    public String toString() {
        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(birthDate);
        return name + ", " + gender + ". Nascimento: " + dataFormatada + ". Pais: " + country;
    }

    @Override
    public int compareTo(Medalhista outro) {
        int comparacaoPais = this.getPais().toUpperCase().compareTo(outro.getPais().toUpperCase());
        if (comparacaoPais != 0) {
            return comparacaoPais;
        } else {
            return this.getName().toUpperCase().compareTo(outro.getName().toUpperCase());
        }

    }

    public int getGoldMedal() {
        return goldMedal;
    }

    public int getSilverMedal() {
        return silverMedal;
    }

    public int getBronzeMedal() {
        return bronzeMedal;
    }
}

enum TipoMedalha {
    OURO,
    PRATA,
    BRONZE
}

class Pais implements Comparable<Pais> {
    private String name;
    private static final int MAX_MEDALHISTAS = 2500;
    private int medalhistasCount = 0;
    private Medalhista[] medalhistas = new Medalhista[MAX_MEDALHISTAS];

    public Pais(String pais) {
        name = pais;
    }

    public String getName() {
        return name;
    }

    public boolean pesquisarMedalhista(String nome) {

        for (Medalhista medalhista : medalhistas) {
            if (medalhista != null && medalhista.getName().equals(nome)) {
                return true;
            }
        }
        return false;
    }

    public Medalhista getMedalhista(String nome) {
        for (Medalhista medalhista : medalhistas) {
            if (medalhista != null && medalhista.getName().equals(nome)) {
                return medalhista;
            }
        }
        return null;
    }

    public void incluirMedalhista(Medalhista medalhista) {
        if (medalhista != null && !pesquisarMedalhista(medalhista.getName())) {
            medalhistas[medalhistasCount] = medalhista;
            medalhistasCount++;
        }
    }

    public int totalDeMedalhas(TipoMedalha tipoMedalha) {
        int total = 0;
        
        for (Medalhista medalhista : medalhistas) {
            if(medalhista == null){
                break;
            }
            if (tipoMedalha == TipoMedalha.OURO) {
                total += medalhista.getGoldMedal();
            } else if (tipoMedalha == TipoMedalha.PRATA) {
                total += medalhista.getSilverMedal();
            } else if (tipoMedalha == TipoMedalha.BRONZE) {
                total += medalhista.getBronzeMedal();
            }
        }
        return total;
    }

    public int totalDeMedalhas() {
        int total = 0;
        for (Medalhista medalhista : medalhistas) {
            if(medalhista == null){
                break;
            }
            total += medalhista.totalMedalhas();
        }
        return total;
    }

    public StringBuilder relatorioDeMedalhas(TipoMedalha tipoMedalha) {
        StringBuilder relatorio = new StringBuilder();
        for (Medalhista medalhista : medalhistas) {
            relatorio.append(medalhista.relatorioDeMedalhas(tipoMedalha));
        }
        return relatorio;
    }

    @Override
    public int compareTo(Pais outroPais) {
        if (this.totalDeMedalhas(TipoMedalha.OURO) != outroPais.totalDeMedalhas(TipoMedalha.OURO)) {
            return Integer.compare(this.totalDeMedalhas(TipoMedalha.OURO), outroPais.totalDeMedalhas(TipoMedalha.OURO));
        } else if (this.totalDeMedalhas(TipoMedalha.PRATA) != outroPais.totalDeMedalhas(TipoMedalha.PRATA)) {
            return Integer.compare(this.totalDeMedalhas(TipoMedalha.PRATA),
                    outroPais.totalDeMedalhas(TipoMedalha.PRATA));
        } else {
            return Integer.compare(this.totalDeMedalhas(TipoMedalha.BRONZE),
                    outroPais.totalDeMedalhas(TipoMedalha.BRONZE));
        }
    }

    @Override
    public String toString() {
        return (String.format("%s: %02d ouros %02d pratas %02d bronzes Total: %02d medalhas.",
                name,
                totalDeMedalhas(TipoMedalha.OURO),
                totalDeMedalhas(TipoMedalha.PRATA),
                totalDeMedalhas(TipoMedalha.BRONZE),
                totalDeMedalhas()));
    }

}

class Evento implements Comparable<Evento> {
    private String event;
    private String discipline;
    private static final int MAX_MEDALHISTAS = 60;
    private int medalhistasCount = 0;
    private Medalhista[] medallists = new Medalhista[MAX_MEDALHISTAS];

    public Evento(String evento, String disciplina) {
        event = evento;
        discipline = disciplina;
    }

    private boolean pesquisarMedalhista(String nome) {
        for (Medalhista medalhista : medallists) {
            if (medalhista !=null && medalhista.getName().equals(nome)) {
                return true;
            }
        }
        return false;
    }

    public void incluirMedalhista(Medalhista medalhista) {
        if (!pesquisarMedalhista(medalhista.getName())) {
            medallists[medalhistasCount] = medalhista;
            medalhistasCount++;
        }
    }

    public StringBuilder relatorioMedalhistas() {
        StringBuilder relatorio = new StringBuilder();
        for (Medalhista medalhista : medallists) {
            relatorio.append(medalhista).append("\n");
        }
        return relatorio;
    }

    @Override
    public int compareTo(Evento outroEvento) {
        if (this.event.compareTo(event) != 0) {
            return this.event.compareTo(outroEvento.event);
        } else {
            return this.discipline.compareTo(outroEvento.discipline);
        }
    }

    @Override
    public String toString() {
        return (String.format("%s - %s", event, discipline));
    }

}

class Medalha {

    private TipoMedalha metalType;
    private LocalDate medalDate;
    private String discipline;
    private String event;

    public Medalha(TipoMedalha tipo, String data, String disciplina, String evento) {
        metalType = tipo;
        medalDate = LocalDate.parse(data);
        discipline = disciplina;
        event = evento;
    }

    public TipoMedalha getTipo() {
        return metalType;
    }

    public String getDiscipline() {
        return discipline;
    }

    public String getEvent() {
        return event;
    }

    @Override
    public String toString() {
        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(medalDate);
        return metalType + " - " + discipline + " - " + event + " - " + dataFormatada;
    }
}

interface IOrdenator<T> {
    T[] ordenar(T[] array);

    void setComparador(Comparator<T> comparador);

    int getComparacoes();

    int getMovimentacoes();

    double getTempoOrdenacao();
}

class QuickSort<T> implements IOrdenator<T> {
    private Comparator<T> comparador;
    private int comparacoes = 0;
    private int movimentacoes = 0;
    private double tempoOrdenacao;

    @Override
    public T[] ordenar(T[] array) {
        long inicio = System.nanoTime();
        quicksort(array, 0, array.length - 1);
        tempoOrdenacao = (System.nanoTime() - inicio) / 1e6;
        return array;
    }

    private void quicksort(T[] array, int esq, int dir) {

        int part;
        comparacoes++;
        if (esq < dir) {
            part = particao(array, esq, dir);
            quicksort(array, esq, part - 1);
            quicksort(array, part + 1, dir);
        }
    }

    private int particao(T[] array, int inicio, int fim) {

        T pivot = array[fim];
        int part = inicio - 1;
        for (int i = inicio; i < fim; i++) {
            comparacoes++;
            if (comparador.compare(array[i], pivot) >= 0) {
                comparacoes++;
                part++;
                swap(array, part, i);
            }
        }
        part++;
        swap(array, part, fim);
        return (part);
    }

    private void swap(T[] array, int i, int j) {
        movimentacoes ++;
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    @Override
    public void setComparador(Comparator<T> comparador) {
        this.comparador = comparador;
    }

    @Override
    public int getComparacoes() {
        return comparacoes;
    }

    @Override
    public int getMovimentacoes() {
        return movimentacoes;
    }

    @Override
    public double getTempoOrdenacao() {
        return tempoOrdenacao;
    }

    public void escreverLog() {
        String matricula = "836079";
        String log = String.format("%s\t%.2f\t%d\t%d", matricula, tempoOrdenacao, comparacoes, movimentacoes);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("836079_quicksort.txt"))) {
            writer.write(log);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

public class App {
    public static void main(String[] args) throws Exception {

        HashMap<String, Medalhista> medalhistas = new HashMap<>();
        HashMap<String, Pais> paises = new HashMap<>();
        HashMap<String, Evento> eventos = new HashMap<>();
        String arquivo = "C:\\Users\\delfi\\OneDrive\\Documentos\\Faculdade\\Terceiro Periodo\\faculdade\\AEDS 2\\medallists.csv";
        String arquivoFaculdade = "C:\\Users\\1489062\\Documents\\medallists.csv";
        String arquivoVerde = "/tmp/medallists.csv";
        try (Stream<String> linhas = Files.lines(Paths.get(arquivoVerde))) {
            linhas.skip(1).forEach(linha -> {
                String[] campos = linha.split(",");
                Medalhista atleta = new Medalhista(campos[0], campos[3], campos[4], campos[5]);
                TipoMedalha tipo = TipoMedalha.valueOf(campos[1]);
                Medalha medalha = new Medalha(tipo, campos[2], campos[6], campos[7]);

                if (medalhistas.containsKey(atleta.getName())) {
                    medalhistas.get(atleta.getName()).incluirMedalha(medalha);
                } else {
                    medalhistas.put(atleta.getName(), atleta);
                    atleta.incluirMedalha(medalha);

                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }

        for (Medalhista medalhista : medalhistas.values()) {
            if (paises.containsKey(medalhista.getCountry())) {
                paises.get(medalhista.getCountry()).incluirMedalhista(medalhista);
            } else {
                Pais pais = new Pais(medalhista.getCountry());
                paises.put(medalhista.getCountry(), pais);
                pais.incluirMedalhista(medalhista);
            }
        }

        Scanner sc = new Scanner(System.in);

        int qtdPaises = sc.nextInt();
        sc.nextLine();

        Pais[] paisesArray = new Pais[qtdPaises];

        for (int i = 0; i < qtdPaises; i++) {
            String novoPais = sc.nextLine();
            paisesArray[i] = paises.get(novoPais);
        }

        QuickSort<Pais> quickSort = new QuickSort<>();
        quickSort.setComparador((pais1, pais2) -> pais1.compareTo(pais2));
        quickSort.ordenar(paisesArray);

        for (Pais pais : paisesArray) {
            System.out.println(paises.get(pais.getName()));
        }

        sc.close();

    }
}
