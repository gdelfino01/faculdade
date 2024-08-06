/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.mavenproject1;

/**
 *
 * @author 1489062
 */
public class Mavenproject1 {
     
    private static int soma(int x, int y){
        if(y == 1)
            return x;
        else return x + soma( x , y - 1);
    }
        
    private static int divis(int x, int y){
        if(x < y) 
            return 0;
        else return 1 + divis( x - y, y);
    }
    
    public static void main(String[] args) {
            
        int x = soma(3, 3);
        
        System.out.println("soma: " + x);
        
        
        int y = divis(15, 3);
        System.out.println("Divisão: " + y);
    }
    
}
