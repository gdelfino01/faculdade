
import java.util.NoSuchElementException;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author delfi
 */
public class Fila<E> {

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
        
        frente = impar.getFrente();
        tras = impar.getTras();
        
        return par;
    }

}
