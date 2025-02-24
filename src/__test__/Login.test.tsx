import { render } from "@testing-library/react";
import Login from "../pages/Login";

jest.mock("wouter", () => ({
    useLocation: jest.fn().mockReturnValue(["/login", jest.fn()]),
}));

test("Renderiza el componente Login sin errores", () => {
    render(<Login />);
});
