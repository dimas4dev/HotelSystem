import { createServer, Model } from "miragejs";
import { v4 as uuidv4 } from "uuid";

export function makeServer() {
    return createServer({
        models: {
            hotel: Model,
            reservation: Model,
        },

        seeds(server) {
            server.create("hotel", {
                id: uuidv4(),
                name: "Hotel Paradise",
                location: "Cartagena, Colombia",
                rooms: [
                    { id: uuidv4(), type: "Suite", baseCost: 250, taxes: 50, price: 300, maxGuests: 10, active: true },
                    { id: uuidv4(), type: "Normal", baseCost: 170, taxes: 30, price: 200, maxGuests: 5, active: true },
                    { id: uuidv4(), type: "Barata", baseCost: 90, taxes: 10, price: 100, maxGuests: 2, active: true },
                ],
                active: true,
            });

            server.create("hotel", {
                id: uuidv4(),
                name: "Sunset Resort",
                location: "Cancún, México",
                rooms: [
                    { id: uuidv4(), type: "Suite", baseCost: 300, taxes: 50, price: 350, maxGuests: 10, active: true },
                    { id: uuidv4(), type: "Normal", baseCost: 180, taxes: 40, price: 220, maxGuests: 5, active: true },
                    { id: uuidv4(), type: "Barata", baseCost: 110, taxes: 10, price: 120, maxGuests: 2, active: true },
                ],
                active: true,
            });

        },

        routes() {
            this.namespace = "api";

            this.get("/hotels", (schema) => {
                return schema.all("hotel");
            });

            this.post("/reservations", (schema, request) => {
                let attrs = JSON.parse(request.requestBody);

                let hotel = schema.find("hotel", attrs.hotelId);
                if (!hotel) {
                    return new Response(JSON.stringify({ error: "Hotel no existe" }), { status: 400, headers: { "Content-Type": "application/json" } });

                }

                let room = hotel.attrs.rooms.find((r) => r.id === attrs.roomId);
                if (!room) {
                    return new Response(JSON.stringify({ error: "La habitacion no existe" }), { status: 400, headers: { "Content-Type": "application/json" } });
                }

                attrs.id = uuidv4();
                return schema.create("reservation", attrs);
            });

            this.get("/reservations", (schema) => {
                return schema.all("reservation");
            });

            this.get("/reservations/:id", (schema, request) => {
                let id = request.params.id;
                return schema.find("reservation", id);
            });

            this.delete("/reservations/:id", (schema, request) => {
                let id = request.params.id;
                let reservation = schema.find("reservation", id);
                return reservation?.destroy();
            });

            this.patch("/hotels/:id", (schema, request) => {
                let id = request.params.id;
                let attrs = JSON.parse(request.requestBody);
                let hotel = schema.find("hotel", id);

                if (!hotel) {
                    return new Response(JSON.stringify({ error: "Hotel no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
                }

                hotel.update({
                    ...(attrs.rooms && { rooms: attrs.rooms }),
                    ...(typeof attrs.active !== "undefined" && { active: attrs.active })
                });

                return { hotel: hotel.attrs };
            });

            this.delete("/hotels/:id", (schema, request) => {
                let id = request.params.id;
                let hotel = schema.find("hotel", id);

                if (!hotel) {
                    return new Response(JSON.stringify({ error: "Hotel no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
                }

                hotel.destroy();
                return new Response(JSON.stringify({ error: "Hotel eliminado correctamente" }), { status: 200, headers: { "Content-Type": "application/json" } });

            });


            this.post("/hotels", (schema, request) => {
                let attrs = JSON.parse(request.requestBody);

                if (!attrs.name || !attrs.location || !Array.isArray(attrs.rooms) || attrs.rooms.length === 0) {
                    return new Response(JSON.stringify({ error: "Todos los campos son obligatorios y debe agregar al menos una habitación." }), { status: 400, headers: { "Content-Type": "application/json" } });
                }

                attrs.id = crypto.randomUUID();

                attrs.rooms = attrs.rooms.map((room) => ({
                    id: crypto.randomUUID(),
                    type: room.type,
                    baseCost: room.baseCost,
                    taxes: room.taxes,
                    price: room.baseCost + room.taxes,
                    maxGuests: room.maxGuests || 1,
                    active: true,
                }));

                return schema.create("hotel", attrs);
            });

            this.patch("/hotels/:hotelId/rooms/:roomId", (schema, request) => {
                let hotelId = request.params.hotelId;
                let roomId = request.params.roomId;
                let attrs = JSON.parse(request.requestBody);

                let hotel = schema.find("hotel", hotelId);
                if (!hotel) {
                    return new Response(JSON.stringify({ error: "Hotel no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
                }

                let updatedRooms = hotel.attrs.rooms.map((room) =>
                    room.id === roomId
                        ? { ...room, ...attrs, price: attrs.baseCost + attrs.taxes }
                        : room
                );

                hotel.update({ rooms: updatedRooms });

                let updatedRoom = updatedRooms.find((room) => room.id === roomId);
                return new Response(JSON.stringify(updatedRoom), { status: 200 });
            });
        },
    });
}
