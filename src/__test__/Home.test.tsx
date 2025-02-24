import { render } from "@testing-library/react";
import Home from "../pages/Home";

test("Renderiza el componente Home sin errores", () => {
    render(<Home />);
});
