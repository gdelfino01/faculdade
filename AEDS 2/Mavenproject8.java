//package com.mycompany.mavenproject8;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLOutput;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.Scanner;
import java.util.stream.Stream;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
/**
 *
 * @author 1489062
 */
class Celula<T> {

    private final T item;
    private Celula<T> proximo;

    public Celula() {
        this.item = null;
        setProximo(null);
    }

    public Celula(T item) {
        this.item = item;
        setProximo(null);
    }

    public Celula(T item, Celula<T> proximo) {
        this.item = item;
        this.proximo = proximo;
    }

    public T getItem() {
        return item;
    }

    public Celula<T> getProximo() {
        return proximo;
    }

    public void setProximo(Celula<T> proximo) {
        this.proximo = proximo;
    }
}

class Lista<E> {

    private Celula<E> primeiro;
    private Celula<E> ultimo;
    private int tamanho;

    public Lista() {

        Celula<E> sentinela = new Celula<>();

        this.primeiro = this.ultimo = sentinela;
        this.tamanho = 0;
    }

    public boolean vazia() {

        return (this.primeiro == this.ultimo);
    }

    public void inserir(E novo, int posicao) {

        Celula<E> anterior, novaCelula, proximaCelula;

        if ((posicao < 0) || (posicao > this.tamanho)) {
            throw new IndexOutOfBoundsException("Não foi possível inserir o item na lista: "
                    + "a posição informada é inválida!");
        }

        anterior = this.primeiro;
        for (int i = 0; i < posicao; i++) {
            anterior = anterior.getProximo();
        }

        novaCelula = new Celula<>(novo);

        proximaCelula = anterior.getProximo();

        anterior.setProximo(novaCelula);
        novaCelula.setProximo(proximaCelula);

        if (posicao == this.tamanho) // a inserção ocorreu na última posição da lista
        {
            this.ultimo = novaCelula;
        }

        this.tamanho++;
    }

    public E remover(int posicao) {

        Celula<E> anterior, celulaRemovida, proximaCelula;

        if (vazia()) {
            throw new IllegalStateException("Não foi possível remover o item da lista: "
                    + "a lista está vazia!");
        }

        if ((posicao < 0) || (posicao >= this.tamanho)) {
            throw new IndexOutOfBoundsException("Não foi possível remover o item da lista: "
                    + "a posição informada é inválida!");
        }

        anterior = this.primeiro;
        for (int i = 0; i < posicao; i++) {
            anterior = anterior.getProximo();
        }

        celulaRemovida = anterior.getProximo();

        proximaCelula = celulaRemovida.getProximo();

        anterior.setProximo(proximaCelula);
        celulaRemovida.setProximo(null);

        if (celulaRemovida == this.ultimo) {
            this.ultimo = anterior;
        }

        this.tamanho--;

        return (celulaRemovida.getItem());
    }

    public void inserirInico(E item) {
        inserir(item, 0);
    }

    public void inserirFinal(E item) {
        inserir(item, tamanho);
    }

    public E removerInicio() {
        return remover(0);
    }

    public boolean localizar(E item) {
        Celula<E> aux = primeiro.getProximo();

        while (aux != null) {
            if (aux.getItem().equals(item)) {
                return true;
            }
            aux = aux.getProximo();
        }

        return false;
    }

    @Override
    public String toString() {
        String saida = "";
        Celula<E> aux = primeiro.getProximo();

        while (aux != null) {
            saida += aux.getItem().toString() + "\n";
            aux = aux.getProximo();
        }

        return saida;
    }

    public void inverter() {
        Lista<E> aux = new Lista<>();

        while (vazia()) {
            aux.inserirInico(this.remover(tamanho));
        }

        this.primeiro = aux.primeiro;
        this.ultimo = aux.ultimo;
        this.tamanho = aux.tamanho;
    }

    public Lista<E> obterListaSemRepeticao() {
        Celula<E> aux = this.primeiro.getProximo();
        Lista<E> lista = new Lista<E>();

        while (aux != null) {
            if (!lista.localizar(aux.getItem())) {
                lista.inserirFinal(aux.getItem());
            }
            aux = aux.getProximo();
        }

        return lista;
    }
}

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



public class Mavenproject8 {

    public static void main(String[] args) {
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

        Lista<Medalhista> lista = new Lista<>();

        Scanner sc = new Scanner(System.in);

        String entrada = sc.nextLine();
        
        while(!entrada.equals("FIM")){
            String entradaSeparada[] = entrada.split("; ");
            
            if(entradaSeparada[0].equals("INSERIR INICIO")){
                lista.inserirInico(medalhistas.get(entradaSeparada[1]));
            } else if(entradaSeparada[0].equals("INSERIR FINAL")){
                lista.inserirFinal(medalhistas.get(entradaSeparada[1]));
            } else if(entradaSeparada[0].equals("REMOVER INICIO")){
                Medalhista aux = lista.removerInicio();
                System.out.println("(REMOVIDO) " + aux);
                System.out.println(aux.relatorioDeMedalhas(TipoMedalha.OURO));
                
                System.out.println("");
            } else if(entradaSeparada[0].equals("SEM REPETICAO")){
                System.out.println("LISTA DE MEDALHISTA SEM REPETICAO");
                System.out.println(lista.obterListaSemRepeticao().toString());
                System.out.println("");
            } else if(entradaSeparada[0].equals("INVERTER")){
                System.out.println("LISTA INVERTIDA DE MEDALHISTAS");
                lista.inverter();
                System.out.println(lista.toString());
                System.out.println("");
            }
            
            entrada = sc.nextLine();
        }


        sc.close();

    }
}
