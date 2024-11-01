
import java.util.NoSuchElementException;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author delfi
 */
public class Pilha<E> {
    
    private Celula<E> topo;
    private Celula<E> fundo;
    
    public Pilha(){
        
        Celula<E> sentinela = new Celula<E>();
        fundo = sentinela;
        topo = sentinela;
        
    }
    
    public int getTamanho() {
        int tamanho =  0;
        Celula<E> atual = topo;
        
        while(atual != fundo){
            tamanho++;
            atual = atual.getProximo();
        }
        return tamanho;
    }
    
    
    public boolean vazia(){
        return fundo == topo;   
    }
    
    public void empilhar(E item){
        
        topo = new Celula<E>(item, topo);
        
    }
    
    public E desempilhar(){
        
        E desempilhado = consultarTopo();
        topo = topo.getProximo();
        return desempilhado;
        
        
    }
    
    public E consultarTopo(){
        
        if(vazia()){
            throw new NoSuchElementException("Não há nenhum item na pilha");
        }
        
        return topo.getItem();
    }
    
    public void imprimir(){
        Celula<E> atual = topo;
        System.out.println("Pilha: ");
        while( atual != null){
            if(atual.getItem() != null){
                System.out.println(atual.getItem() + " ");
            }
            atual = atual.getProximo();
        }
        System.out.println();
        
    }
    
    public void concatenar(Pilha<E> pilha){
        Pilha<E> temp = new Pilha<E>();
        
        while(!pilha.vazia()){
            temp.empilhar(pilha.desempilhar());
        }
        
        while(!temp.vazia()){
            this.empilhar(temp.desempilhar());
        }
        
    }
    
    public void inverter(){
        Pilha<E> temp1 = new Pilha<E>();
        Pilha<E> temp2 = new Pilha<E>();
        
        while(!vazia()){
            temp1.empilhar(desempilhar());
        }
        
        while(!temp1.vazia()){
            temp2.empilhar(temp1.desempilhar());
        }
        
        while(!temp2.vazia()){
            empilhar(temp2.desempilhar());
        }
    }
    
}
