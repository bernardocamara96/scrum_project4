import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import util.HashUtil;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

public class UserClient {
    private final Client client;
    private String baseUrl;
    private final Gson gson;
    public UserClient(String baseUrl) {
        this.client = ClientBuilder.newClient();
        this.baseUrl = baseUrl;
        this.gson = new Gson();
    }
    public void addUserRandomly(int numberOfUsers) {
        String randomUserApiUrl = "https://randomuser.me/api/?results=" + numberOfUsers;
        Response response = client.target(randomUserApiUrl)
                .request(MediaType.APPLICATION_JSON)
                .get();

        if (response.getStatusInfo().getFamily() == Response.Status.Family.SUCCESSFUL) {
            String usersJson = response.readEntity(String.class);
            List<User> users = convertJsonToUsers(usersJson);

            for (User user : users) {
                addUserToSystem(user);
                System.out.println();
            }
        } else {
            System.out.println("Erro ao encontrar utilizadores aleatórios: " + response.getStatus());
        }
    }

    private List<User> convertJsonToUsers(String usersJson) {
        List<User> users = new ArrayList<>();
        JsonObject jsonResponse = JsonParser.parseString(usersJson).getAsJsonObject();
        JsonArray results = jsonResponse.getAsJsonArray("results");

        for (int i = 0; i < results.size(); i++) {
            JsonObject jsonUser = results.get(i).getAsJsonObject();
            String email = jsonUser.get("email").getAsString();
            JsonObject nameObject = jsonUser.getAsJsonObject("name");
            String firstName = nameObject.get("first").getAsString();
            String lastName = nameObject.get("last").getAsString();
            JsonObject loginObject = jsonUser.getAsJsonObject("login");
            String password = HashUtil.toSHA256(loginObject.get("password").getAsString());
            String phoneNumber = jsonUser.get("phone").getAsString();
            String photoURL = jsonUser.getAsJsonObject("picture").get("large").getAsString();
            String username = email.substring(0, email.indexOf('@'));

            User user = new User(username, password, email, firstName, lastName, phoneNumber, photoURL, "developer");
            users.add(user);
        }

        return users;
    }
    private void addUserToSystem(User user) {
        System.out.println("A enviar utilizador: " + gson.toJson(user));

        Response response = client.target(baseUrl)
                .request(MediaType.APPLICATION_JSON)
                .post(Entity.entity(user, MediaType.APPLICATION_JSON));

        if (response.getStatus() != Response.Status.CREATED.getStatusCode()) { // Assumindo que o sucesso seja HTTP 201
            System.out.println("Código de resposta: " + response.getStatus());
            System.out.println("Resposta: " + response.readEntity(String.class));
        }
    }
}
