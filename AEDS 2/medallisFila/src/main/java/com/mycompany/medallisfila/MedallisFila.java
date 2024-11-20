/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.medallisfila;

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

/**
 *
 * @author delfi
 */
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
        setProximo(proximo);
    }

    public Celula<T> getProximo() {
        return proximo;
    }

    public void setProximo(Celula<T> proximo) {
        this.proximo = proximo;
    }

    public T getItem() {
        return item;
    }

}

class Fila<E> {

    Celula<E> frente;
    Celula<E> tras;

    public Fila() {
        Celula<E> sentinela = new Celula<E>();
        frente = tras = sentinela;
    }

    public boolean vazia() {
        return frente == tras;
    }

    public void enfileirar(E item) {
        Celula<E> novaCelula = new Celula<E>(item);

        tras.setProximo(novaCelula);
        tras = tras.getProximo();

    }

    public Celula<E> getFrente() {
        return frente;
    }

    public E desenfileirar() {

        E item = null;
        Celula<E> primeiro;

        item = consultarPrimeiro();

        primeiro = frente.getProximo();
        frente.setProximo(primeiro.getProximo());

        primeiro.setProximo(null);

        if (primeiro == tras) {
            tras = frente;
        }

        return item;

    }

    public E consultarPrimeiro() {

        if (vazia()) {
            throw new NoSuchElementException("Nao há nenhum item na fila!");
        }

        return frente.getProximo().getItem();

    }

    public void imprimir() {

        Celula<E> aux;

        if (vazia()) {
            System.out.println("A fila está vazia!");
        } else {
            aux = this.frente.getProximo();
            while (aux != null) {
                System.out.println(aux.getItem());
                aux = aux.getProximo();
            }
        }
    }

    public void concatenar(Fila<E> fila) {

        while (!fila.vazia()) {
            enfileirar(fila.desenfileirar());
        }
    }

    public int obterNumeroItens() {
        Celula<E> aux = frente.getProximo();
        int cont = 0;

        while (aux != null) {
            cont++;
            aux = aux.getProximo();
        }

        return cont;
    }

    public boolean verificarExistencia(E item) {
        Celula<E> aux = frente.getProximo();

        while (aux != null) {
            if (aux.getItem().equals(item)) {
                return true;
            }
            aux = aux.getProximo();
        }

        return false;
    }

    public int obterNumeroDeItensAFrente(E item) {

        boolean verifica = verificarExistencia(item);

        if (!verifica) {
            throw new NoSuchElementException("Nao há este item na fila!");
        }

        int cont = 0;

        Celula<E> aux = frente.getProximo();

        while (aux != null && !aux.getItem().equals(item)) {
            cont++;
            aux = aux.getProximo();
        }
        return cont;
    }

    public Fila<E> copiar() {
        Fila<E> copia = new Fila<>();
        Celula<E> aux = frente.getProximo();

        while (aux != null) {
            copia.enfileirar(aux.getItem());
            aux = aux.getProximo();
        }

        return copia;
    }

    public Celula<E> getTras() {
        return tras;
    }
    
    public void esvaziar(){
        this.tras = this.frente;
    }

    public Fila<E> dividir() {

        int cont = obterNumeroItens();
        Fila<E> par = new Fila<>();
        Fila<E> impar = new Fila<>();

        for (int i = 0; i < cont; i++) {
            if (i % 2 == 0) {
                par.enfileirar(desenfileirar());
            } else {
                impar.enfileirar(desenfileirar());
            }
        }

        frente = par.getFrente();
        tras = par.getTras();

        return impar;
    }

}

public class MedallisFila {

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

        Fila<Medalhista> fila = new Fila<>();

        Scanner sc = new Scanner(System.in);

        String entrada = sc.nextLine();

        while (!entrada.equals("FIM")) {
            String[] entradaSeparada = entrada.split(" ", 2);
            if(entradaSeparada[0].equals("IMPRIMIR")){
                System.out.println("");
                fila.imprimir();
            }
            if (entradaSeparada[0].equals("ENFILEIRAR")) {
                fila.enfileirar(medalhistas.get(entradaSeparada[1]));
                
            } else {
                if (entradaSeparada[0].equals("DESENFILEIRAR")) {
                    System.out.println("(DESENFILEIRADO) " + fila.desenfileirar().getName());
                } else {
                    if (entradaSeparada[0].equals("EXISTE")) {
                        boolean existe = fila.verificarExistencia(medalhistas.get(entradaSeparada[1]));
                        if (existe) {
                            System.out.println(entradaSeparada[1] + " EXISTE NA FILA? SIM");
                        } else {
                            System.out.println(entradaSeparada[1] + " EXISTE NA FILA? NAO");
                        }
                    } else {
                        if (entradaSeparada[0].equals("DIVIDIR")) {
                            
                            Fila<Medalhista> atual = fila.dividir();
                            System.out.println();
                            System.out.println("FILA ORIGINAL");
                            atual.imprimir();
                            atual.esvaziar();                            
                            
                            System.out.println();
                            System.out.println("FILA NOVA");
                            fila.imprimir();
                            fila.esvaziar();
                            System.out.println();
                        }
                    }
                }
            }

            entrada = sc.nextLine();

        }

        sc.close();

    }
}
