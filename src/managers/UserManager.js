import fs from "fs";
import path from "path";

export default class UserManager {
    constructor() {
        this.path = path.join("src", "data", "users.json");
    }

    // MÉTODOS 

    async _readFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return []; 
        }
    }

    async _writeFile(users) {
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(users, null, 2)
        );
    }


    // Obtener todos los usuarios
    async getUsers() {
        return await this._readFile();
    }

    // Obtener usuario por ID
    async getUserById(id) {
        const users = await this._readFile();
        return users.find(u => u.id == id) || null;
    }

    // Crear usuario nuevo
    async addUser(userData) {
        const required = ["name", "email", "password"];

        for (let field of required) {
            if (!userData[field]) {
                throw new Error(`Falta el campo obligatorio: ${field}`);
            }
        }

        const users = await this._readFile();

        // validar email único
        const emailExists = users.some(u => u.email === userData.email);
        if (emailExists) throw new Error("El email ya está registrado");

        const newUser = {
            id: users.length === 0 ? 1 : users[users.length - 1].id + 1,
            role: "user",
            ...userData
        };

        users.push(newUser);
        await this._writeFile(users);

        return newUser;
    }

    // Actualizar usuario
    async updateUser(id, updates) {
        const users = await this._readFile();
        const index = users.findIndex(u => u.id == id);

        if (index === -1) return null;

        // No permitir modificar id
        delete updates.id;

        const updatedUser = {
            ...users[index],
            ...updates
        };

        users[index] = updatedUser;

        await this._writeFile(users);
        return updatedUser;
    }

    // Eliminar usuario
    async deleteUser(id) {
        const users = await this._readFile();
        const filtered = users.filter(u => u.id != id);

        if (filtered.length === users.length) return false;

        await this._writeFile(filtered);
        return true;
    }
}