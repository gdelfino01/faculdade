/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author delfi
 */
public class Lista<E> {

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

        Celula<E> anterior, proxima;

        if (posicao < 0 || posicao >= tamanho) {
            throw new IndexOutOfBoundsException("Não foi possível inserir o item na lista: "
                    + "a posição informada é inválida!");
        }

        anterior = primeiro;
        for (int i = 0; i < posicao; i++) {
            anterior = anterior.getProximo();
        }

        Celula<E> novaCelula = new Celula<>(novo);

        proxima = anterior.getProximo();

        anterior.setProximo(novaCelula);
        novaCelula.setProximo(proxima);

        if (posicao == this.tamanho) {
            this.ultimo = novaCelula;
        }

        this.tamanho++;
    }

    public int getTamanho() {
        return tamanho;
    }

    public E remover(int posicao) {

        Celula<E> anterior, proxima, removida;

        if (vazia()) {
            throw new IndexOutOfBoundsException("Não foi possível remover o item na lista: "
                    + "a lista está vazia!");
        }

        if (posicao < 0 || posicao > tamanho) {
            throw new IndexOutOfBoundsException("Não foi possível remover o item na lista: "
                    + "a posição informada é inválida!");
        }

        anterior = primeiro;
        for (int i = 0; i < posicao; i++) {
            anterior = anterior.getProximo();
        }

        removida = anterior.getProximo();
        proxima = removida.getProximo();

        anterior.setProximo(proxima);
        removida.setProximo(null);

        if (removida == this.ultimo) {
            this.ultimo = anterior;
        }

        tamanho--;

        return removida.getItem();

    }

    public void imprimir() {
        Celula<E> atual = primeiro;

        while (atual != null) {
            if (atual.getItem() != null) {
                System.out.print(atual.getItem() + " ");
            }

            atual = atual.getProximo();
        }

        System.out.println();
    }

    public void inserirFinal(E item) {
        Celula<E> novaCelula = new Celula<>(item);

        this.ultimo.setProximo(novaCelula);

        ultimo = novaCelula;
        this.tamanho++;

    }

    public E removerInicio() {
        if (vazia()) {
            throw new IndexOutOfBoundsException("Não foi possível remover o item na lista: "
                    + "a lista está vazia!");
        }
        Celula<E> removida = primeiro.getProximo();
        Celula<E> anterior, proximo;
        anterior = this.primeiro;
        proximo = removida.getProximo();

        anterior.setProximo(proximo);
        removida.setProximo(null);

        if (removida == this.ultimo) {
            this.ultimo = anterior;
        }

        tamanho--;

        return removida.getItem();

    }

    public E remover(E item) {
        if (vazia()) {
            throw new IndexOutOfBoundsException("Não foi possível remover o item na lista: "
                    + "a lista está vazia!");
        }

        Celula<E> anterior = primeiro;
        Celula<E> atual = anterior.getProximo();

        while (atual != null) {
            if (atual.getItem().equals(item)) {
                anterior.setProximo(atual.getProximo());
                tamanho--;
                return item;
            }
            anterior = atual;
            atual = atual.getProximo();
        }
        throw new IndexOutOfBoundsException("Não foi possível remover o item na lista: "
                + "o item não existe na lista!");
    }

}
