/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package aplication;

/**
 *
 * @author Gustavo Delfino
 */
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.stream.Stream;

/**
 * Classe Medalhista: representa um medalhista olímpico e sua coleção de
 * medalhas nas Olimpíadas de Paris 2024
 */
class Medalhista {

    /**
     * Para criar o vetor com no máximo 8 medalhas
     */
    private static final int MAX_MEDALHAS = 8;
    /**
     * Nome do medalhista
     */
    private String name;
    /**
     * Gênero do medalhista
     */
    private String gender;
    /**
     * Data de nascimento do medalhista
     */
    private LocalDate birthDate;
    /**
     * País do medalhista
     */
    private String country;
    /**
     * Coleção de medalhas do medalhista
     */
    private Medalha[] medals = new Medalha[MAX_MEDALHAS];
    /**
     * Contador de medalhas e índice para controlar o vetor de medalhas
     */
    private int medalCount;

    /**
     * Cria um medalhista olímpico. Nenhum dado precisa ser validado.
     *
     * @param nome Nome do medalhista no formato "SOBRENONE nome"
     * @param genero Gênero do medalhista
     * @param nascimento Data de nascimento do medalhista
     * @param pais País do medalhista (conforme dados originais, em inglês)
     */
    public Medalhista(String nome, String genero, String nascimento, String pais) {
//TODO código do construtor
        name = nome;
        gender = genero;
        birthDate = LocalDate.parse(nascimento);
        country = pais;
    }
    
    public Medalhista(String nome, String genero, String nascimento, String pais, Medalha medal, Medalha[] medalhas) {
//TODO código do construtor
        name = nome;
        gender = genero;
        birthDate = LocalDate.parse(nascimento);
        country = pais;
        loop:
        for(int i = 0; i < medals.length; i++){
            if(medals[i] == null){
                medals[i] = medal;
                break;
            }else{
                medals[i] = medalhas[i];
            }
        }
    }

    /**
     * Inclui uma medalha na coleção do medalhista. Retorna a quantidade atual
     * de medalhas do atleta.
     *
     * @param medalha A medalha a ser armazenada.
     * @return A quantidade total de medalhas do atleta após a inclusão.
     */
    public int incluirMedalha(Medalha medalha) {
//TODO código da lógica de inclusão de medalha no vetor do medalhista
        for (int i = 0; i < medals.length; i++) {
            if (medals[i] == null) {
                medals[i] = medalha;
                return 1;
            } else {
            }
        }
        return 0;
    }


    public String getCountry() {
        return country;
    }

    /**
     * Total de medalhas do atleta. É um número maior ou igual a 0.
     *
     * @return Inteiro com o total de medalhas do atleta (>=0)
     */
    public int totalMedalhas() {
//TODO lógica para retornar o total de medalhas do atleta
        int contMedalhas = 0;
        for (int i = 0; i < medals.length; i++) {
            if (medals[i] != null) {
                contMedalhas++;
            }
        }
        return contMedalhas;
    }

    /**
     * Retorna um relatório das medalhas do atleta conforme o tipo solicitado
     * pelo parâmetro. Veja no enunciado da atividade o formato correto deste
     * relatório. Em caso de não possuir medalhas deste tipo, a resposta deve
     * ser "Nao possui medalha de TIPO".
     *
     * @param tipo Tipo da medalha para o relatório
     * @return Uma string, multilinhas, com o relatório de medalhas daquele
     * tipo. Em caso de não possuir medalhas deste tipo, a resposta deve ser
     * "Nao possui medalha de TIPO".
     */
    public int relatorioDeMedalhas(TipoMedalha tipo) {
//TODO lógica para gerar uma string conforme documentado acima
        int cont = 0;
        for (Medalha medal : medals) {
            if (medal != null && medal.getTipo() == tipo) {
                System.out.println(medal);
                cont++;
            }
        }

        if (cont == 0) {
            System.out.println("Nao possui medalha de " + tipo);
        }
        return cont;
    }

    /**
     * Retorna o nome do país do medalhista (conforme arquivo original em
     * inglês.)
     *
     * @return String contendo o nome do país do medalhista (conforme arquivo
     * original em inglês, iniciais em maiúsculas.)
     */
    public String getPais() {
        return country;
    }

    /**
     * Retorna uma cópia da data de nascimento do medalhista.
     *
     * @return LocalDate com a data de nascimento do medalhista.
     */
    public String getNascimento() {
        return DateTimeFormatter.ofPattern("dd/MM/yyyy").format(birthDate);
    }

    public String getGender() {
        return gender;
    }

    public String getName() {
        return name;
    }

    public Medalha[] getMedals() {
        return medals;
    }

    /**
     * Deve retornar os dados pessoais do medalhista, sem as medalhas, conforme
     * especificado no enunciado da atividade.
     *
     * @return String de uma linha, com os dados do medalhista, sem dados da
     * medalha.
     */
    @Override
    public String toString() {
//TODO lógica para retornar uma string conforme documentação acima
        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(birthDate);

        return name + ", " + gender + ". Nascimento: " + dataFormatada + ". Pais: " + country;
    }
}

/**
 * Enumerador para medalhas de ouro, prata e bronze
 */
enum TipoMedalha {
    OURO,
    PRATA,
    BRONZE
}

/**
 * Representa uma medalha obtida nos Jogos Olímpicos de Paris em 2024.
 */
class Medalha {

    /**
     * Tipo/cor da medalha conforme o enumerador
     */
    private TipoMedalha metalType;
    /**
     * Data de obtenção da medalha
     */
    private LocalDate medalDate;
    /**
     * Disciplina da medalha, conforme arquivo de dados
     */
    private String discipline;
    /**
     * Evento da medalha, conforme arquivo de dados
     */
    private String event;

    /**
     * Cria uma medalha com os dados do parâmetro. Nenhum dado é validado
     */
    public Medalha(TipoMedalha tipo, String data, String disciplina, String evento) {
        metalType = tipo;
        medalDate = LocalDate.parse(data);
        discipline = disciplina;
        event = evento;
    }

    /**
     * Retorna o tipo de medalha, conforme o enumerador
     *
     * @return TipoMedalha (enumerador) com o tipo/cor desta medalha
     */
    public TipoMedalha getTipo() {
        return metalType;
    }

    public String getDiscipline() {
        return discipline;
    }

    public String getEvent() {
        return event;
    }

    /**
     * Retorna uma string com o "relatório" da medalha de acordo com o
     * especificado no enunciado do problema. Contém uma linha que já formata a
     * data da medalha no formato brasileiro. O restante deve ser implementado.
     */
    @Override
    public String toString() {
        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(medalDate);

//TODO restante da lógica para criar um relatório de medalha conforme enunciado.
        return metalType + " - " + discipline + " - " + event + " - " + dataFormatada;
    }
}

public class Aplicacao {

// TODO código da classe deve ser implementado.
    public static void main(String[] args) {

        HashMap<Medalhista, String> medalhistas = new HashMap<>();
        String arquivo = "C:\\Users\\delfi\\OneDrive\\Documentos\\Faculdade\\Terceiro Periodo\\faculdade\\AEDS 2\\Aplicacao\\src\\main\\java\\aplication\\medallists.csv";
        try (Stream<String> linhas = Files.lines(Paths.get(arquivo))) {
            // Pula a primeira linha e processa o resto
            linhas.skip(1).forEach(linha -> {
                String[] campos = linha.split(",");
                Medalhista atleta = new Medalhista(campos[0], campos[3], campos[4], campos[5]);
                TipoMedalha tipo = TipoMedalha.valueOf(campos[1]);
                Medalha medalha = new Medalha(tipo, campos[2], campos[6], campos[7]);
                atleta.incluirMedalha(medalha);
                if (medalhistas.containsValue(atleta)) {
                    medalhistas.get(atleta);
                    Medalhista aux = new Medalhista(atleta.getName(), atleta.getGender(),atleta.getNascimento() , atleta.getCountry(), medalha, atleta.getMedals());
                    
                    medalhistas.put(aux, atleta.getName());
                } else {
                    medalhistas.put(atleta, atleta.getName());
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }

        for (Medalhista m : medalhistas.keySet()) {
            System.out.println(m);
            System.out.println(m.relatorioDeMedalhas(TipoMedalha.OURO));
            System.out.println(m.relatorioDeMedalhas(TipoMedalha.BRONZE));
            System.out.println(m.relatorioDeMedalhas(TipoMedalha.PRATA));

        }
    }
}
