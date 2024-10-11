
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
             if (medalhista == null) {
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
             if (medalhista == null) {
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
     private String sport;
     private static final int MAX_MEDALHISTAS = 60;
     private int medalhistasCount = 0;
     private Medalhista[] medallists = new Medalhista[MAX_MEDALHISTAS];
 
     public Evento(String evento, String esporte) {
         event = evento;
         sport = esporte;
     }
 
     public String getEvent() {
         return event;
     }
 
     public String getsport() {
         return sport;
     }
 
     private boolean pesquisarMedalhista(String nome) {
         for (Medalhista medalhista : medallists) {
             if (medalhista != null && medalhista.getName().equals(nome)) {
                 return true;
             }
         }
         return false;
     }
 
     public void incluirMedalhista(Medalhista medalhista) {
         if (!pesquisarMedalhista(medalhista.getName()) && medalhistasCount < MAX_MEDALHISTAS && medalhista != null) {
             medallists[medalhistasCount] = medalhista;
             medalhistasCount++;
         }
     }
 
     public StringBuilder relatorioMedalhistas() {
         StringBuilder relatorio = new StringBuilder();
         for (Medalhista medalhista : medallists) {
             if (medalhista != null)
                 relatorio.append(medalhista).append("\n");
         }
         return relatorio;
     }
 
     @Override
     public int compareTo(Evento outroEvento) {
         if (this.event.compareTo(outroEvento.getEvent()) != 0){
             return this.event.compareTo(outroEvento.getEvent());
         } else {
             return this.sport.compareTo(outroEvento.sport);
         }
     }
 
     @Override
     public String toString() {
         return (String.format("%s - %s", event, sport));
     }
 
 }
 
 class Medalha {
 
     private TipoMedalha metalType;
     private LocalDate medalDate;
     private String sport;
     private String event;
 
     public Medalha(TipoMedalha tipo, String data, String esporte, String evento) {
         metalType = tipo;
         medalDate = LocalDate.parse(data);
         sport = esporte;
         event = evento;
     }
 
     public TipoMedalha getTipo() {
         return metalType;
     }
 
     public String getsport() {
         return sport;
     }
 
     public String getEvent() {
         return event;
     }
 
     @Override
     public String toString() {
         String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(medalDate);
         return metalType + " - " + sport + " - " + event + "-" + dataFormatada;
     }
 }
 
 interface IOrdenator<T> {
     T[] ordenar(T[] array);
 
     void setComparador(Comparator<T> comparador);
 
     int getComparacoes();
 
     int getMovimentacoes();
 
     double getTempoOrdenacao();
 }
 
 class MergeSort<T> implements IOrdenator<T> {
     private Comparator<T> comparador;
     private int comparacoes = 0;
     private int movimentacoes = 0;
     private double tempoOrdenacao;
 
     @Override
     public T[] ordenar(T[] array) {
         long inicio = System.nanoTime();
         mergeSort(array);
         tempoOrdenacao = (System.nanoTime() - inicio) / 1e6;
         return array;
     }
 
     public void mergeSort(T[] array) {
         mergesort(array, 0, array.length - 1);
     }
 
     private void mergesort(T[] array, int esq, int dir) {
         if (esq < dir) {
             int meio = (esq + dir) / 2;
             mergesort(array, esq, meio);
             mergesort(array, meio + 1, dir);
             intercalar(array, esq, meio, dir);
         }
     }
 
     private void intercalar(T[] array, int esq, int meio, int dir) {
 
         int n1, n2, i, j, k;
 
         // Definir tamanho dos dois subarrays
         n1 = meio - esq + 1;
         n2 = dir - meio;
 
         @SuppressWarnings("unchecked")
         T[] a1 = (T[]) new Object[n1];
         @SuppressWarnings("unchecked")
         T[] a2 = (T[]) new Object[n2];
 
         // Inicializar primeiro subarray
 
         for (i = 0; i < n1; i++) {
             comparacoes++;
             movimentacoes++;
             a1[i] = array[esq + i];
 
         }
 
         // Inicializar segundo subarray
         for (j = 0; j < n2; j++) {
             comparacoes++;
             movimentacoes++;
             a2[j] = array[meio + j + 1];
 
         }
 
         // Intercalação propriamente dita
         for (i = j = 0, k = esq; (i < n1 && j < n2); k++) {
             comparacoes++;
             if (comparador.compare(a1[i], a2[j]) <= 0) {
                 array[k] = a1[i++];
             } else {
                 array[k] = a2[j++];
             }
         }
 
         if (i == n1)
             for (; k <= dir; k++) {
                 comparacoes++;
                 array[k] = a2[j++];
 
             }
         else
             for (; k <= dir; k++) {
                 comparacoes++;
                 array[k] = a1[i++];
 
             }
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
         try (BufferedWriter writer = new BufferedWriter(new FileWriter("836079_mergesort.txt"))) {
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
         HashMap<String, Evento> eventos2 = new HashMap<>();
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
  
         try (Stream<String> linhas = Files.lines(Paths.get(arquivoVerde))) {
             linhas.skip(1).forEach(linha -> {
                 String[] campos = linha.split(",");
                 Medalhista atleta = new Medalhista(campos[0], campos[3], campos[4], campos[5]);
                 TipoMedalha tipo = TipoMedalha.valueOf(campos[1]);
                 Medalha medalha = new Medalha(tipo, campos[2], campos[6], campos[7]);
                 Evento evento = new Evento(campos[6], campos[7]);
 
                 if (eventos2.containsKey(evento.getEvent() + " - " + evento.getsport())) {
                     eventos2.get(evento.getEvent() + " - " + evento.getsport()).incluirMedalhista(atleta);
                 } else {
                     eventos2.put(evento.getEvent() + " - " + evento.getsport(), evento);
                     evento.incluirMedalhista(atleta);
 
                 }
             });
         }catch (IOException e) {
            e.printStackTrace();
        }
 

         
 
          Scanner sc = new Scanner(System.in);
 
          int entradas;
          entradas = sc.nextInt();
          sc.nextLine();
          Evento[] eventosArray = new Evento[entradas];
          
          for (int i = 0; i < entradas; i++) {
              
              String event = sc.nextLine();
              Evento ev = eventos2.get(event);
              eventosArray[i] = ev;
                      
          }
          
          MergeSort<Evento> merge = new MergeSort<>();
          merge.setComparador(Evento :: compareTo);
          eventosArray = merge.ordenar(eventosArray);
          merge.escreverLog();
          
          
          for (Evento evento : eventosArray) {
              System.out.println(evento);
              System.out.println(evento.relatorioMedalhistas());
              //System.out.println("");
          }
          
          sc.close();
 
     }
 }
 
 