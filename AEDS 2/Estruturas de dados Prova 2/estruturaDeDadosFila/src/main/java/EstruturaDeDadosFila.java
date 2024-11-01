/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

/**
 *
 * @author delfi
 */
public class EstruturaDeDadosFila {

    public static void main(String[] args) {

        Fila<Integer> fila = new Fila<>();
        Fila<Integer> aux = new Fila<>();

        fila.enfileirar(1);
        fila.enfileirar(2);
        fila.enfileirar(3);
        fila.imprimir();
        System.out.println("Quantidade: " + fila.obterNumeroItens());
        System.out.println();

        aux.enfileirar(4);
        aux.enfileirar(5);
        aux.enfileirar(6);
        aux.imprimir();
        System.out.println("Quantidade: " + aux.obterNumeroItens());
        System.out.println();

        fila.concatenar(aux);
        fila.imprimir();
        System.out.println("Quantidade: " + fila.obterNumeroItens());
        System.out.println(fila.verificarExistencia(1));

        System.out.println("Quantidade  a frente: " + fila.obterNumeroDeItensAFrente(4));

        Fila<Integer> novaFila = fila.copiar();
        System.out.println("Nova fila: ");
        novaFila.imprimir();

        Fila<Integer> novaFila2 = fila.dividir();
        System.out.println("Fila dividida par: ");
        novaFila2.imprimir();
        
        System.out.println("Fila impar");
        fila.imprimir();

    }
}
