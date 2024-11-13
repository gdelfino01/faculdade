
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.NoSuchElementException;
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

class Celula<T> {

    private final T item;
    private Celula<T> anterior;
    private Celula<T> proximo;

    public Celula() {
        this.item = null;
        setAnterior(null);
        setProximo(null);
    }

    public Celula(T item) {
        this.item = item;
        setAnterior(null);
        setProximo(null);
    }

    public Celula(T item, Celula<T> anterior, Celula<T> proximo) {
        this.item = item;
        this.anterior = anterior;
        this.proximo = proximo;
    }

    public T getItem() {
        return item;
    }

    public Celula<T> getAnterior() {
        return anterior;
    }

    public void setAnterior(Celula<T> anterior) {
        this.anterior = anterior;
    }

    public Celula<T> getProximo() {
        return proximo;
    }

    public void setProximo(Celula<T> proximo) {
        this.proximo = proximo;
    }
}

class ListaDuplamenteEncadeada<E> {

    private Celula<E> primeiro;
    private Celula<E> ultimo;
    private int tamanho;

    public ListaDuplamenteEncadeada() {

        Celula<E> sentinela = new Celula<>();

        this.primeiro = this.ultimo = sentinela;
        this.tamanho = 0;
    }

    public int getTamanho() {
        return tamanho;
    }

    public Celula<E> getPrimeiro() {
        return primeiro;
    }

    public Celula<E> getUltimo() {
        return ultimo;
    }

    public void setPrimeiro(Celula<E> primeiro) {
        this.primeiro = primeiro;
    }

    public void setUltimo(Celula<E> ultimo) {
        this.ultimo = ultimo;
    }

    public void setTamanho(int tamanho) {
        this.tamanho = tamanho;
    }


    public boolean vazia() {

        return (this.primeiro == this.ultimo);
    }

    public void inserirFinal(E novo) {

        Celula<E> novaCelula = new Celula<>(novo, this.ultimo, null);

        this.ultimo.setProximo(novaCelula);
        this.ultimo = novaCelula;

        this.tamanho++;

    }

    public E removerFinal() {

        Celula<E> removida, penultima;

        if (vazia()) {
            throw new IllegalStateException("Não foi possível remover o último item da lista: "
                    + "a lista está vazia!");
        }

        removida = this.ultimo;

        penultima = this.ultimo.getAnterior();
        penultima.setProximo(null);

        removida.setAnterior(null);

        this.ultimo = penultima;

        this.tamanho--;

        return (removida.getItem());
    }

    public E removerInicio() {
        if (vazia()) {
            throw new IllegalStateException("Não foi possível remover o último item da lista: "
                    + "a lista está vazia!");
        }

        Celula<E> removida = this.primeiro.getProximo();
        this.primeiro.setProximo(removida.getProximo());

        if (removida.getProximo() != null) {
            removida.getProximo().setAnterior(this.primeiro);
        } else {
            this.ultimo = this.primeiro;
        }

        removida.setProximo(null);
        removida.setAnterior(null);

        this.tamanho--;

        return removida.getItem();
    }



    
    public void mesclar(ListaDuplamenteEncadeada<E> outraLista) {
        ListaDuplamenteEncadeada<E> aux = new ListaDuplamenteEncadeada<>();

        while (!vazia() || !outraLista.vazia()) {
            if (!vazia()) {
                aux.inserirFinal(removerInicio());
            }
            if (!outraLista.vazia()) {
                aux.inserirFinal(outraLista.removerInicio());
            }
        }

        this.primeiro = aux.primeiro;
        this.ultimo = aux.ultimo;
        this.tamanho = aux.tamanho;
    }

    public boolean contemSequencia(ListaDuplamenteEncadeada<E> outraLista) {
        Celula<E> primeiro = outraLista.primeiro.getProximo();

        Celula<E> aux1, aux2;

        aux1 = this.primeiro.getProximo();
        aux2 = outraLista.primeiro.getProximo();

        while (aux1 != null) {
            if (aux1.getItem().equals(aux2.getItem())) {
                aux2 = aux2.getProximo();
            } else {
                aux2 = primeiro;
            }

            if (aux2 == null) {
                return true;
            }

            aux1 = aux1.getProximo();

        }

        return false;
    }

    public void esvaziar() {
        this.primeiro = this.ultimo = new Celula<>();
        this.tamanho = 0;
    }

    @Override
    public String toString() {
        String saida = "";

        Celula<E> aux = this.primeiro.getProximo();

        while (aux != null) {
            saida += aux.getItem().toString() + "\n";
            aux = aux.getProximo();
        }

        return saida;
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

        ListaDuplamenteEncadeada<Medalhista> lista = new ListaDuplamenteEncadeada<>();

        Scanner sc = new Scanner(System.in);

        String entrada = sc.nextLine();

        while (!entrada.equals("FIM")) {
            String entradaSeparada[] = entrada.split("; ");

            if (entradaSeparada[0].equals("INSERIR FINAL")) {
                lista.inserirFinal(medalhistas.get(entradaSeparada[1]));
            } else if (entradaSeparada[0].equals("CONTEM SEQUENCIA")) {
                ListaDuplamenteEncadeada<Medalhista> listaAuxiliar = new ListaDuplamenteEncadeada<>();
                for(int i = 0; i < Integer.parseInt(entradaSeparada[1]); i++){
                    String entradaAux = sc.nextLine();
                    listaAuxiliar.inserirFinal(medalhistas.get(entradaAux));
                    
                }
                if(lista.contemSequencia(listaAuxiliar)){
                    System.out.println("LISTA DE MEDALHISTAS CONTEM SEQUENCIA");
                } else {
                    System.out.println("LISTA DE MEDALHISTAS NAO CONTEM SEQUENCIA");
                }
                System.out.println();
                listaAuxiliar.esvaziar();
                
            } else if(entradaSeparada[0].equals("MESCLAR")){
                ListaDuplamenteEncadeada<Medalhista> listaAuxiliar = new ListaDuplamenteEncadeada<>();
                for(int i = 0; i < Integer.parseInt(entradaSeparada[1]); i++){
                    String entradaAux = sc.nextLine();
                    listaAuxiliar.inserirFinal(medalhistas.get(entradaAux));
                    
                }
                lista.mesclar(listaAuxiliar);

                System.out.println("LISTA MESCLADA DE MEDALHISTAS");
                System.out.println(lista.toString());
                listaAuxiliar.esvaziar();
                lista.esvaziar();
            }

            entrada = sc.nextLine();
        }

        sc.close();
    }
}
