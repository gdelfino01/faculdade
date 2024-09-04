

/**
 *
 * @author Gustavo Delfino
 */
public class Pesquisa {

    public static void main(String[] args) {

        int n = 7_500_000;
        int execution = 0;

        while (n > 0 && n <= 2_000_000_000) {
            System.out.println();

            System.out.println("Valor de n: " + n);
            int[] vet = new int[n];

            for (int i = 0; i < vet.length; i++) {
                vet[i] = i;
            }
            int x = 0;
            long[] vetTime = new long[5];
            for (int j = 0; j < 3; j++) {
                switch (j) {
                    case 0:
                        x = 0;
                        System.out.println("Pesquisar por: " + x + " melhor caso");
                        break;

                    case 1:
                        x = n / 2;
                        System.out.println("Pesquisar por: " + x + " caso medio");
                        break;
                    case 2:
                        x = n;
                        System.out.println("Pesquisar por: " + x + " pior caso");
                        deafault:
                        break;
                }
                System.out.println("Execucao " + execution);

                for (int i = 0; i < 5; i++) {

                    long tempoInicial = System.nanoTime();

                    System.out.println("Resultado pesquisa sequencial: " + pesquisaSequencial(vet, x));

                    long tempoFinal = System.nanoTime() - tempoInicial;
                    vetTime[i] = tempoFinal;
                }

                System.out.println();
                System.out.println("Media aritmetica do tempo de execucao para n = " + n + ": " + (double) (encontraMaiorMenor(vetTime) / 3));
                System.out.println();

                System.out.println("");

                for (int i = 0; i < 5; i++) {
                    long tempoInicial = System.nanoTime();
                    try {
                        System.out.println("Resultado pesquisa binaria: " + pesquisaBinaria(vet, x));

                    } catch (RuntimeException e) {
                        
                    }

                    long tempoFinal = System.nanoTime() - tempoInicial;
                    vetTime[i] = tempoFinal;
                }

                System.out.println();
                System.out.println("Media aritmetica do tempo de execucao para n = " + n + ": " + (double) (encontraMaiorMenor(vetTime) / 3));
                System.out.println();

                execution++;
            }

            System.out.println("---------------------------------------------");

            n *= 2;

            if (x >= 2_000_000_000) {
                break;
            }
        }

    }

    public static long encontraMaiorMenor(long[] vet) {
        int pMaior = 0, pMenor = 0;
        long sum = vet[0];

        for (int i = 1; i < 5; i++) {
            if (vet[i] > vet[pMaior]) {
                pMaior = i;
            }
            if (vet[i] < vet[pMenor]) {
                pMenor = i;
            }
            sum += vet[i];
        }

        sum -= vet[pMenor];
        sum -= vet[pMaior];

        return sum;
    }

    public static int pesquisaSequencial(int[] vet, int x) {
        boolean resp = false;
        int n = vet.length;
        int cont = 0;
        for (int i = 0; i < n; i++) {
            if (vet[i] == x) {
                resp = true;
                i = n;
            }
            cont++;
        }
        return cont;
    }

    public static int pesquisaBinaria(int[] vet, int x) {
        int dir = vet.length - 1, esq = 0, cont = 0;
        while (esq <= dir) {
            int meio = (esq + dir) / 2;
            cont++;
            if (x == vet[meio]) {
                return cont;
            } else if (x > vet[meio]) {
                esq = meio + 1;
            } else {
                dir = meio - 1;
            }
        }
        return cont;
    }
}
