"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.addUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ where: { email } });
    if (user) {
        return res.status(400).json({
            error: `Ya existe un usuario con el email ${email}`
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        const newUser = yield user_1.default.create({
            email,
            password: hashedPassword
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error al agregar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
exports.addUser = addUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({
            where: { email: email }
        });
        if (!user) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }
        const result = yield bcrypt_1.default.compare(password, user.password);
        if (result) {
            const token = jsonwebtoken_1.default.sign({
                email: email
            }, process.env.SECRET_KEY);
            res.json(token);
        }
        else {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }
    }
    catch (error) {
        console.error("Error al autenticar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
exports.loginUser = loginUser;
