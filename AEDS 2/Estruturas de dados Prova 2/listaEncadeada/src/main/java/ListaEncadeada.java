/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

/**
 *
 * @author delfi
 */
public class ListaEncadeada {

    public static void main(String[] args) {
        Lista<String> lista = new Lista<>();

        lista.inserirFinal("a");
        lista.inserirFinal("b");
        lista.inserirFinal("c");
        lista.inserirFinal("d");

        System.out.println("Impressao lista: ");
        lista.imprimir();
        System.out.println("Tamanho: " + lista.getTamanho());

        System.out.println("");

        lista.inserir("z", 1);
        System.out.println("Impressao lista adicionando a posicao 1: ");
        lista.imprimir();
        System.out.println("Tamanho: " + lista.getTamanho());
        System.out.println(" ");

        lista.removerInicio();
        System.out.println("Removido primeiro item: ");
        lista.imprimir();
        System.out.println("Tamanho: " + lista.getTamanho());
        System.out.println("");

        lista.remover("p");
        System.out.println("Remover item c: ");
        lista.imprimir();
        System.out.println("Tamanho: " + lista.getTamanho());
        System.out.println("");
        
    }
}
