import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
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
        if (getGoldMedal() != outro.getGoldMedal()) {
            return Integer.compare(outro.getGoldMedal(), this.getGoldMedal());
        }
        if (getSilverMedal() != outro.getSilverMedal()) {
            return Integer.compare(outro.getSilverMedal(), this.getSilverMedal());
        }
        if (getBronzeMedal() != outro.getBronzeMedal()) {
            return Integer.compare(outro.getBronzeMedal(), this.getBronzeMedal());
        }
        //return getName().compareTo(outro.getName());
        return getName().toLowerCase().compareTo(outro.getName().toLowerCase());
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

class HeapSort<T> implements IOrdenator<T> {
    private Comparator<T> comparador;
    private int comparacoes;
    private int movimentacoes;
    private double tempoOrdenacao;

    @Override
    public T[] ordenar(T[] array) {
        long inicio = System.nanoTime(); 
        comparacoes = 0;
        movimentacoes = 0;

        boolean trocou;
        int n = array.length;

        for (int i = 0; i < n - 1; i++) {
            trocou = false;

            for (int j = 0; j < n - i - 1; j++) {
                comparacoes++;
                if (comparador.compare(array[j], array[j + 1]) > 0) {
                    T temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    movimentacoes++;
                    trocou = true;
                }
            }

            if (!trocou) {
                break;
            }
        }

        long fim = System.nanoTime(); 
        tempoOrdenacao = (fim - inicio) / 1e6; 
        return array;
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
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("836079_bubblesort.txt"))) {
            writer.write(log);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

public class App {
    public static void main(String[] args) throws Exception {

        HashMap<String, Medalhista> medalhistas = new HashMap<>();
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

        Scanner sc = new Scanner(System.in);
        int numeroDeEntradas;

        numeroDeEntradas = sc.nextInt();
        sc.nextLine();
        Medalhista[] medalhistasArray = new Medalhista[numeroDeEntradas];
        for (int i = 0; i < numeroDeEntradas; i++) {
            String nome = sc.nextLine();
            Medalhista medalhista = medalhistas.get(nome);
            if (medalhista == null) {
                System.out.println("Medalhista não encontrado: " + nome);
                return;
            }
            medalhistasArray[i] = medalhista;
        }

        BubbleSort<Medalhista> bubbleSort = new BubbleSort<>();
        bubbleSort.setComparador((medalhista1, medalhista2) -> medalhista1.compareTo(medalhista2));
        medalhistasArray = bubbleSort.ordenar(medalhistasArray);        
        bubbleSort.escreverLog();

        for (Medalhista medalhista : medalhistasArray) {
            System.out.println(medalhista);
            if (medalhista.getGoldMedal() != 0) {
                System.out
                        .println("Quantidade de medalhas de ouro: " + medalhista.getGoldMedal());
            }
            if (medalhista.getSilverMedal() != 0) {
                System.out.println(
                        "Quantidade de medalhas de prata: " + medalhista.getSilverMedal());
            }
            if (medalhista.getBronzeMedal() != 0) {
                System.out.println(
                        "Quantidade de medalhas de bronze: " + medalhista.getBronzeMedal());
            }
            System.out.println();
        }
        sc.close();

    }
}
