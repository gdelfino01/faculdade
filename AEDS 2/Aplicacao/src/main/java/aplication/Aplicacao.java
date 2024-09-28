 package aplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Scanner;
import java.util.stream.Stream;

class Medalhista {

    private static final int MAX_MEDALHAS = 8;
    private String name;
    private String gender;
    private LocalDate birthDate;
    private String country;
    private Medalha[] medals = new Medalha[MAX_MEDALHAS];
    private int medalCount = 0;

    public Medalhista(String nome, String genero, String nascimento, String pais) {
        name = nome;
        gender = genero;
        birthDate = LocalDate.parse(nascimento);
        country = pais;
    }

    public void setMedals(Medalha[] medals) {
        this.medals = medals;
    }

    public void incluirMedalha(Medalha medalha) {
        medals[medalCount] = medalha;
        medalCount++;
    }

    public String getCountry() {
        return country;
    }

    public int totalMedalhas() {

        return medalCount;
    }

    public StringBuilder relatorioDeMedalhas(TipoMedalha tipo) {
        StringBuilder relatorio = new StringBuilder();
        int cont = 0;

        for (Medalha medal : medals) {
            if (medal != null && medal.getTipo().equals(tipo)) {
                relatorio.append(medal).append("\n");
                cont++;
            }
        }

        if (cont == 0) {
            System.out.println("Nao possui medalha de " + tipo);
        }
        return relatorio;
    }

    public String getPais() {
        return country;
    }

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

    @Override
    public String toString() {
        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(birthDate);
        return name + ", " + gender + ". Nascimento: " + dataFormatada + ". Pais: " + country;
    }
}

enum TipoMedalha {
    OURO,
    PRATA,
    BRONZE
}

class Medalha {

    private TipoMedalha metalType;
    private LocalDate medalDate;
    private String discipline;
    private String event;

    public Medalha(TipoMedalha tipo, String data, String disciplina, String evento) {
        metalType = tipo;
        medalDate = LocalDate.parse(data);
        discipline = disciplina;
        event = evento;
    }

    public TipoMedalha getTipo() {
        return metalType;
    }

    public String getDiscipline() {
        return discipline;
    }

    public String getEvent() {
        return event;
    }

    @Override
    public String toString() {
        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(medalDate);
        return metalType + " - " + discipline + " - " + event + " - " + dataFormatada;
    }
}

public class Aplicacao {

    public static void main(String[] args) {
        HashMap<String, Medalhista> medalhistas = new HashMap<>();
        String arquivo = "C:\\Users\\delfi\\OneDrive\\Documentos\\Faculdade\\Terceiro Periodo\\faculdade\\AEDS 2\\Aplicacao\\src\\main\\java\\aplication\\medallists.csv";
        String arquivoVerde = "/tmp/medallists.csv";
        try (Stream<String> linhas = Files.lines(Paths.get(arquivoVerde))) {
            linhas.skip(1).forEach(linha -> {
                String[] campos = linha.split(",");
                Medalhista atleta = new Medalhista(campos[0], campos[3], campos[4], campos[5]);
                TipoMedalha tipo = TipoMedalha.valueOf(campos[1]);
                Medalha medalha = new Medalha(tipo, campos[2], campos[6], campos[7]);

                if (medalhistas.containsKey(atleta.getName())) {
                    medalhistas.get(atleta.getName()).incluirMedalha(medalha);
                } else {
                    medalhistas.put(atleta.getName(), atleta);
                    atleta.incluirMedalha(medalha);

                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }

        Scanner sc = new Scanner(System.in);
        String entrada;

        entrada = sc.nextLine();
        while (!entrada.equals("FIM")) {
            String[] entradas = new String[2];

            entradas = entrada.split(",");
            TipoMedalha tipo = TipoMedalha.valueOf(entradas[1]);

            System.out.println(medalhistas.get(entradas[0]));
            System.out.println(medalhistas.get(entradas[0]).relatorioDeMedalhas(tipo));
            entrada = sc.nextLine();
        }

        sc.close();
       
    }
}
