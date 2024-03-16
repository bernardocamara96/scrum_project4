const example = require("./example");

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o link da fotografia escolhido é válido e retorna true*/
/**************************************************************************************************************************************************************************************/
test("photo is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({
      value: "https://example.com/photo.jpg",
   }));
   // resultado esperado
   expect(example.validatePhotoURL()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});
/**************************************************************************************************************************************************************************************/
/*teste que verifica se o link da fotografia escolhido é inválido, retorna false e chama o alerta*/
/**************************************************************************************************************************************************************************************/

test("photo is invalid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "ab" }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validatePhotoURL()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Photo URL must be between 3 and 500 characters.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o username escolhido é válido e retorna true */
/**************************************************************************************************************************************************************************************/

test("username is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "Paulo" }));
   // resultado esperado
   expect(example.validateUsername()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o username escolhido é inválido e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("username is invalid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({
      value: "a",
   }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validateUsername()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Username must be between 2 and 25 characters.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a password escolhida é válida e retorna true e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("password is valid", () => {
   // mock dos valores de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "1234", value: "1234" }));
   // resultado esperado
   expect(example.validatePassword()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a password escolhida é inválida e retorna false e o alerta é chamado*/
/* valores diferentes */
/**************************************************************************************************************************************************************************************/

test("password is invalid, not same", () => {
   // mock do valores de document.getElementById
   const values = ["1234", "12345"];
   document.getElementById = jest.fn(() => ({ value: values.shift() }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validatePassword()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Passwords must match and be at least 4 characters long.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a password escolhida é inválida e retorna false e o alerta é chamado*/
/* tamanho insuficiente */
/**************************************************************************************************************************************************************************************/

test("password is invalid, too short", () => {
   // mock do valores de document.getElementById
   const values = ["123", "123"];
   document.getElementById = jest.fn(() => ({ value: values.shift() }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validatePassword()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Passwords must match and be at least 4 characters long.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o email escolhido é válido e retorna true */
/**************************************************************************************************************************************************************************************/

test("email is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "email@email.com" }));
   // resultado esperado
   expect(example.validateEmail()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o email escolhido é inválido e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("email is invalid, without @", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "emailaaa." }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validateEmail()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Please enter a valid email address.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o nome escolhido é válido e retorna true */
/**************************************************************************************************************************************************************************************/

test("name is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "Paulo" }));
   // resultado esperado
   expect(example.validateName()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o nome escolhido é inválido e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("name is invalid, without last name", () => {
   // mock do valor de document.getElementById
   const values = ["Paula", ""];
   document.getElementById = jest.fn(() => ({ value: values.shift() }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validateName()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("First name and last name must be between 1 and 25 characters.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o link escolhido é válido e retorna true */
/**************************************************************************************************************************************************************************************/

test("URL is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "https://example.com/photo.jpg" }));
   // resultado esperado
   expect(example.isValidURL("https://example.com/photo.jpg")).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se as tasks são ordenadas corretamente*/
/**************************************************************************************************************************************************************************************/

test("order tasks", () => {
   // mock das tasks
   const tasks = [
      { name: "Task 1", priority: 2 },
      { name: "Task 2", priority: 1 },
      { name: "Task 3", priority: 3 },
   ];
   // resultado esperado
   expect(example.orderTasks(tasks)).toEqual([
      { name: "Task 3", priority: 3 },
      { name: "Task 1", priority: 2 },
      { name: "Task 2", priority: 1 },
   ]);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o título da task é válido e retorna true */
/**************************************************************************************************************************************************************************************/

test("title is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "Task 1" }));
   // resultado esperado
   expect(example.validateTitle()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});
/**************************************************************************************************************************************************************************************/
/*teste que verifica se o título da task é inválido e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("title is invalid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: "" }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validateTitle()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Title must be between 2 and 20 characters.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a data inicial é antes da data final e retorna true */
/**************************************************************************************************************************************************************************************/

test("start date is before end date", () => {
   // Mock the value of document.getElementById
   document.getElementById = jest.fn((id) => ({ value: id === "startDate" ? "2019-01-01" : "2019-01-02" }));

   // Trigger your validation function
   const isValid = example.validateStartDateBeforeEndDate();

   // Assert the result
   expect(isValid).toBe(true);

   // Clear the mock
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a data inicial é depois da data final e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("start date is before end date", () => {
   // Create a mock for document.getElementById
   const getElementByIdMock = jest.spyOn(document, "getElementById");
   getElementByIdMock.mockReturnValueOnce({ value: "2019-01-02" }).mockReturnValueOnce({ value: "2019-01-01" });

   // Trigger your validation function
   const isValid = example.validateStartDateBeforeEndDate();

   // Assert the result
   expect(isValid).toBe(false);

   // Restore the mock
   getElementByIdMock.mockRestore();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a prioridade da task é válida e retorna true */
/**************************************************************************************************************************************************************************************/

test("priority is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: 3 }));
   // resultado esperado
   expect(example.validatePriority()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a prioridade da task é inválida e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("priority is invalid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: 6 }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validatePriority()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Priority must be between 0 and 400.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o status da task é válido e retorna true */
/**************************************************************************************************************************************************************************************/

test("status is valid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: 100 }));
   // resultado esperado
   expect(example.validateStatus()).toBe(true);
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se o status da task é inválido e retorna false e o alerta é chamado*/
/**************************************************************************************************************************************************************************************/

test("status is invalid", () => {
   // mock do valor de document.getElementById
   document.getElementById = jest.fn(() => ({ value: 101 }));
   // fazer o spyOn para permitir saber se window.alert foi chamado
   jest.spyOn(window, "alert").mockImplementation(() => {});
   // resultado esperado
   expect(example.validateStatus()).toBe(false);
   // verificar o alerta com spyOn
   expect(window.alert).toHaveBeenCalledWith("Status must be between 0 and 400.");
   // limpar mocks
   jest.clearAllMocks();
});

/**************************************************************************************************************************************************************************************/
/*teste que verifica se a password foi bem encripata*/
/**************************************************************************************************************************************************************************************/
