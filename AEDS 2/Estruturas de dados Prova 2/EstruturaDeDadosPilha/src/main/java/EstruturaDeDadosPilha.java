/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

/**
 *
 * @author delfi
 */
public class EstruturaDeDadosPilha {

    public static void main(String[] args) {

        Pilha<Integer> minhaPilha = new Pilha<Integer>();

        minhaPilha.empilhar(1);
        minhaPilha.empilhar(2);
        minhaPilha.empilhar(3);

        System.out.println("Impressao pilha 1: ");
        minhaPilha.imprimir();
        System.out.println("Tamanho Pilha 1:");
        System.out.println(minhaPilha.getTamanho());
        System.out.println();

        Pilha<Integer> minhaPilha2 = new Pilha<Integer>();
        minhaPilha2.empilhar(5);
        minhaPilha2.empilhar(6);
        minhaPilha2.empilhar(7);
        
        System.out.println("Impressao pilha 2: ");
        minhaPilha2.imprimir();
        System.out.println("Tamanho Pilha 2:");
        System.out.println(minhaPilha2.getTamanho());
        System.out.println();
        
        minhaPilha.concatenar(minhaPilha2);
        
        System.out.println("Impressao pilha concatenada: ");
        minhaPilha.imprimir();
        System.out.println("Tamanho Pilha concatenada:");
        System.out.println(minhaPilha.getTamanho());
        System.out.println();
        
        System.out.println("Impressao pilha inversa");
        minhaPilha.inverter();
        minhaPilha.imprimir();
        System.out.println("Tamanho pilha Inversa:");
        System.out.println(minhaPilha.getTamanho());
        System.out.println();
    }
}
