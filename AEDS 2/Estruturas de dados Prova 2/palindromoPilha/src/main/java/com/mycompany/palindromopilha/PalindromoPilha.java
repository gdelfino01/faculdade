/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.palindromopilha;

import java.util.Objects;
import java.util.Scanner;

/**
 *
 * @author delfi
 */
public class PalindromoPilha {

    public static void main(String[] args) {
        
        Scanner sc = new Scanner(System.in);
        
        String entrada = sc.nextLine();
        
        while(!entrada.equals("FIM")){
            Pilha<Character> pilha = new Pilha<>();
            
            for(int i = 0; i < entrada.length(); i++){
                pilha.empilhar(entrada.charAt(i));
            }
            
            boolean verifica = palindromo(pilha);
            
            if(verifica){
                System.out.println( entrada + " e palindromo de: " + entrada);
            } else System.out.println(entrada + " nao e palindromo de: " + entrada);
            
            entrada = sc.nextLine();
        }
    }
    
    public static boolean palindromo(Pilha<Character> pilha){
        Pilha<Character> aux = new Pilha<Character>();
        aux = pilha.clone();
        aux.inverter();
        int tamanho =  pilha.getTamanho();
        int cont = 0;
        
        while(!aux.vazia()){
            Character p = pilha.desempilhar();
            Character a = aux.desempilhar();
            
            if(Objects.equals(p, a)){
                cont++;
            }
        }
       return tamanho == cont;
    }
}
