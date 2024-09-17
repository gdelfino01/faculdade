/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */


import java.util.Scanner;

/**
 *
 * @author GUstavo Delfino
 */
public class Mavenproject5 {

    private static StringBuilder ordena(String linha1, String linha2) {
        StringBuilder nomeCompleto = new StringBuilder();
        int cont1 = 0, cont2 = 0;
        
        int maior = 0;
        
        if(linha1.length() > linha2.length()){
            maior = linha1.length();
        } else maior = linha2.length();
        
        for (int i = 0; i < maior; i += 2) {
            if (i < linha1.length() - 1) {
                nomeCompleto.append(linha1.substring(i, i + 2));
                cont1 += 2;
            }
            if (i < linha2.length() - 1) {
                nomeCompleto.append(linha2.substring(i, i + 2));
                cont2 += 2;
            }
        }

        if (cont1 < linha1.length()) {
            nomeCompleto.append(linha1.substring(cont1, linha1.length()));
        }

        if (cont2 < linha2.length()) {
            nomeCompleto.append(linha2.substring(cont2, linha2.length()));
        }

        return nomeCompleto;
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        String linha1 = sc.nextLine();
        String linha2 = sc.nextLine();
        
        do{
        System.out.println(ordena(linha1, linha2));
        
        linha1 = sc.nextLine();
        if(linha1.contains("FIM")) break;
        linha2 = sc.nextLine();
        if(linha2.contains("FIM")) break;
        }while(!linha1.contains("FIM") || !linha2.contains("FIM"));
        

        sc.close();
    }
}
