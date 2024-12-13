const express = require('express');
const path = require('path');
const cors = require('cors');
const conexion = require('./database');

const app = express();
const port = 3000;

// Middleware CORS
const corsOptions = {
    origin: 'http://localhost:8081',  // Permitir el origen del servidor estático
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Manejo de solicitudes OPTIONS

app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para registrar persona, empleado y telefono
//Funcional
app.post('/registrar', (req, res) => {
    const { id_suc, name1, name2, apellido1, apellido2, direccion, correo, nacimiento, telefono1, descrip_telefono1, telefono2, descrip_telefono2 } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryPersona = 'INSERT INTO persona (pnombre, snombre, papellido, sapellido, direccion, correo, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?)';
        conexion.query(queryPersona, [name1, name2, apellido1, apellido2, direccion, correo, nacimiento], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR insert persona', details: err.message });
                });
            }

            const personaId = results.insertId;

            const queryEmpleado = 'INSERT INTO empleado (sucursal_id, persona_id) VALUES (?, ?)';
            conexion.query(queryEmpleado, [id_suc, personaId], (err, results) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR insert empleado', details: err.message });
                    });
                }

                const queryTelefono = 'INSERT INTO telefono (numero, descripcion, persona_id) VALUES (?, ?, ?), (?, ?, ?)';
                conexion.query(queryTelefono, [telefono1, descrip_telefono1, personaId, telefono2, descrip_telefono2, personaId], (err, results) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR insert telefono', details: err.message });
                        });
                    }

                    conexion.commit(err => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                            });
                        }
                        res.status(201).json({ message: 'Datos registrados exitosamente' });
                    });
                });
            });
        });
    });
});

// Endpoint para registrar persona, cliente y telefono
//Funcional
app.post('/registrar_cliente', (req, res) => {
    const { name1, name2, apellido1, apellido2, direccion, correo, nacimiento, telefono1, descrip_telefono1, telefono2, descrip_telefono2 } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryPersona = 'INSERT INTO persona (pnombre, snombre, papellido, sapellido, direccion, correo, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?)';
        conexion.query(queryPersona, [name1, name2, apellido1, apellido2, direccion, correo, nacimiento], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR insert persona', details: err.message });
                });
            }

            const personaId = results.insertId;

            const queryCliente = 'INSERT INTO cliente (persona_id) VALUES (?)';
            conexion.query(queryCliente, [personaId], (err, results) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR insert empleado', details: err.message });
                    });
                }

                const queryTelefono = 'INSERT INTO telefono (numero, descripcion, persona_id) VALUES (?, ?, ?), (?, ?, ?)';
                conexion.query(queryTelefono, [telefono1, descrip_telefono1, personaId, telefono2, descrip_telefono2, personaId], (err, results) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR insert telefono', details: err.message });
                        });
                    }

                    conexion.commit(err => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                            });
                        }
                        res.status(201).json({ message: 'Datos registrados exitosamente' });
                    });
                });
            });
        });
    });
});

// Endpoint para registrar producto, bodega, proveedor, sucursal
//FUNCINAL
app.post('/registrar_producto', (req, res) => {
    const { id_producto, f_ingreso, c_ingreso, p_costo, p_venta, id_bodega, id_proveedor } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryProvee = 'INSERT INTO provee (cantidad, producto_id, proveedor_id) VALUES (?, ?, ?)';
        conexion.query(queryProvee, [c_ingreso, id_producto, id_proveedor], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR insert provee', details: err.message });
                });
            }

            const queryLote = 'INSERT INTO lote (fecha_ingreso, cantidad_ingreso, existencia, precio_costo, precio_venta, producto_id) VALUES (?, ?, ?, ?, ?, ?)';
            conexion.query(queryLote, [f_ingreso, c_ingreso, c_ingreso, p_costo, p_venta, id_producto], (err, results) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR insert lote', details: err.message });
                    });
                }
                const loteId = results.insertId;

                const queryBodegaLote = 'INSERT INTO bodega_tiene_lote (lote_id, bodega_id) VALUES (?, ?)';
                conexion.query(queryBodegaLote, [loteId, id_bodega], (err, results) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR insert bodega_tiene_lote', details: err.message });
                        });
                    }

                    conexion.commit(err => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                            });
                        }
                        res.status(201).json({ message: 'Datos registrados exitosamente' });
                    });
            }); });
        });
    });
});

// Endpoint para registrar producto, bodega, proveedor, sucursal
//FUNCIONAL
app.post('/registrar_producto_nuevo', (req, res) => {
    const { nombre_producto, id_categoria, id_temporada, f_ingreso, c_ingreso, p_costo, p_venta, id_bodega, id_proveedor } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryProducto = 'INSERT INTO producto (nombre, categoria_id, temporada_u_ocasion_id) VALUES (?, ?, ?)';
        conexion.query(queryProducto, [nombre_producto, id_categoria, id_temporada], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR insert producto', details: err.message });
                });
            }

            const productoId = results.insertId;

            const queryProvee = 'INSERT INTO provee (cantidad, producto_id, proveedor_id) VALUES (?, ?, ?)';
            conexion.query(queryProvee, [c_ingreso, productoId, id_proveedor], (err, results) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR insert provee', details: err.message });
                    });
                }

                const queryLote = 'INSERT INTO lote (fecha_ingreso, cantidad_ingreso, existencia, precio_costo, precio_venta, producto_id) VALUES (?, ?, ?, ?, ?, ?)';
                conexion.query(queryLote, [f_ingreso, c_ingreso, c_ingreso, p_costo, p_venta, productoId], (err, results) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR insert lote', details: err.message });
                        });
                    }
                    const loteId = results.insertId;

                    const queryBodegaLote = 'INSERT INTO bodega_tiene_lote (lote_id, bodega_id) VALUES (?, ?)';
                    conexion.query(queryBodegaLote, [loteId, id_bodega], (err, results) => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR insert bodega_tiene_lote', details: err.message });
                            });
                        }

                        conexion.commit(err => {
                            if (err) {
                                return conexion.rollback(() => {
                                    res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                                });
                            }
                            res.status(201).json({ message: 'Datos registrados exitosamente' });
                        });
                }); });
            });
        });
    });
});

// Endpoint para registrar producto, bodega, proveedor, sucursal
//FUNCIONAL
app.post('/registrar_producto_proveedor_nuevo', (req, res) => {
    const { nombre_producto, id_categoria, id_temporada, f_ingreso, c_ingreso, p_costo, p_venta, id_bodega, nombre_proveedor, direccion, descripcion, id_tipo_proveedor } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryProducto = 'INSERT INTO producto (nombre, categoria_id, temporada_u_ocasion_id) VALUES (?, ?, ?)';
        conexion.query(queryProducto, [nombre_producto, id_categoria, id_temporada], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR insert producto', details: err.message });
                });
            }

            const productoId = results.insertId;
            
            const queryProducto = 'INSERT INTO proveedor (nombre_proveedor, direccion, descripcion, tipo_proveedor_id) VALUES (?, ?, ?, ?)';
            conexion.query(queryProducto, [nombre_proveedor, direccion, descripcion, id_tipo_proveedor], (err, results) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR insert producto', details: err.message });
                    });
                }

                const proveedorId = results.insertId;

                const queryProvee = 'INSERT INTO provee (cantidad, producto_id, proveedor_id) VALUES (?, ?, ?)';
                conexion.query(queryProvee, [c_ingreso, productoId, proveedorId], (err, results) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR insert provee', details: err.message });
                        });
                    }

                    const queryLote = 'INSERT INTO lote (fecha_ingreso, cantidad_ingreso, existencia, precio_costo, precio_venta, producto_id) VALUES (?, ?, ?, ?, ?, ?)';
                    conexion.query(queryLote, [f_ingreso, c_ingreso, c_ingreso, p_costo, p_venta, productoId], (err, results) => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR insert lote', details: err.message });
                            });
                        }
                        const loteId = results.insertId;

                        const queryBodegaLote = 'INSERT INTO bodega_tiene_lote (lote_id, bodega_id) VALUES (?, ?)';
                        conexion.query(queryBodegaLote, [loteId, id_bodega], (err, results) => {
                            if (err) {
                                return conexion.rollback(() => {
                                    res.status(500).json({ error: 'ERROR insert bodega_tiene_lote', details: err.message });
                                });
                            }

                            conexion.commit(err => {
                                if (err) {
                                    return conexion.rollback(() => {
                                        res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                                    });
                                }
                                res.status(201).json({ message: 'Datos registrados exitosamente' });
                            });
                    }); });
                });
            });
        });
    });
});

// Endpoint para obtener datos del empleado
//Funcional
app.get('/empleado/:id', (req, res) => {
    const empleadoId = req.params.id;

    // Consulta para obtener los datos del empleado y de la persona
    const queryEmpleado = `
        SELECT e.*, p.*
        FROM empleado e
        JOIN persona p ON e.persona_id = p.id
        WHERE e.id = ?`;

    // Consulta para obtener los teléfonos del empleado
    const queryTelefonos = `
        SELECT t.numero, t.descripcion, t.id
        FROM telefono t
        JOIN persona p ON t.persona_id = p.id
        JOIN empleado e ON p.id = e.persona_id
        WHERE e.id = ?`;

    conexion.query(queryEmpleado, [empleadoId], (err, resultsEmpleado) => {
        if (err) {
            return res.status(500).json({ error: 'ERROR fetching empleado', details: err.message });
        }
        if (resultsEmpleado.length === 0) {
            return res.status(404).json({ error: 'Empleado not found' });
        }

        const empleado = resultsEmpleado[0];

        // Obtener los teléfonos del empleado
        conexion.query(queryTelefonos, [empleadoId], (err, resultsTelefonos) => {
            if (err) {
                return res.status(500).json({ error: 'ERROR fetching telefonos', details: err.message });
            }

            // Asignar los teléfonos y descripciones al empleado
            empleado.telefono1 = resultsTelefonos[0] ? resultsTelefonos[0].numero : '';
            empleado.id_telefono1 = resultsTelefonos[0] ? resultsTelefonos[0].id : '';
            empleado.descrip_telefono1 = resultsTelefonos[0] ? resultsTelefonos[0].descripcion : '';
            empleado.telefono2 = resultsTelefonos[1] ? resultsTelefonos[1].numero : '';
            empleado.id_telefono2 = resultsTelefonos[1] ? resultsTelefonos[1].id : '';
            empleado.descrip_telefono2 = resultsTelefonos[1] ? resultsTelefonos[1].descripcion : '';

            res.status(200).json(empleado);
        });
    });
});

// Endpoint para obtener datos del cliente
//Funcional
app.get('/cliente/:id', (req, res) => {
    const clienteId = req.params.id;

    // Consulta para obtener los datos del cliente y de la persona
    const queryCliente = `
        SELECT c.*, p.*
        FROM cliente c
        JOIN persona p ON c.persona_id = p.id
        WHERE c.id = ?`;

    // Consulta para obtener los teléfonos del cliente
    const queryTelefonos = `
        SELECT t.numero, t.descripcion, t.id
        FROM telefono t
        JOIN persona p ON t.persona_id = p.id
        JOIN cliente c ON p.id = c.persona_id
        WHERE c.id = ?`;

    conexion.query(queryCliente, [clienteId], (err, resultsCliente) => {
        if (err) {
            return res.status(500).json({ error: 'ERROR fetching cliente', details: err.message });
        }
        if (resultsCliente.length === 0) {
            return res.status(404).json({ error: 'Cliente not found' });
        }

        const cliente = resultsCliente[0];

        // Obtener los teléfonos del cliente
        conexion.query(queryTelefonos, [clienteId], (err, resultsTelefonos) => {
            if (err) {
                return res.status(500).json({ error: 'ERROR fetching telefonos', details: err.message });
            }

            // Asignar los teléfonos y descripciones al empleado
            cliente.telefono1 = resultsTelefonos[0] ? resultsTelefonos[0].numero : '';
            cliente.id_telefono1 = resultsTelefonos[0] ? resultsTelefonos[0].id : '';
            cliente.descrip_telefono1 = resultsTelefonos[0] ? resultsTelefonos[0].descripcion : '';
            cliente.telefono2 = resultsTelefonos[1] ? resultsTelefonos[1].numero : '';
            cliente.id_telefono2 = resultsTelefonos[1] ? resultsTelefonos[1].id : '';
            cliente.descrip_telefono2 = resultsTelefonos[1] ? resultsTelefonos[1].descripcion : '';

            res.status(200).json(cliente);
        });
    });
});

// Endpoint para actualizar datos del empleado
//Funcional
app.put('/empleado/:id', (req, res) => {
    const empleadoId = req.params.id;
    const { name1, name2, apellido1, apellido2, direccion, correo, nacimiento, telefono1, id_telefono1, descrip_telefono1, telefono2, id_telefono2, descrip_telefono2 } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryPersona = `UPDATE persona
                              SET pnombre = ?, snombre = ?, papellido = ?, sapellido = ?, direccion = ?, correo = ?, fecha_nacimiento = ?
                              WHERE id= ?`;
        var a = conexion.query(queryPersona, [name1, name2, apellido1, apellido2, direccion, correo, nacimiento, empleadoId], (err, results) => {
            console.log(a.sql);
            
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR update persona', details: err.message });
                });
            }

            const queryTelefono1 = `UPDATE telefono
                        SET numero = ?, descripcion = ?
                        WHERE id = ?`;

            var b = conexion.query(queryTelefono1, [telefono1, descrip_telefono1, id_telefono1], (err, results) => {
                console.log(b.sql);
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR update telefono1', details: err.message });
                    });
                }
                
                const queryTelefono2 = `UPDATE telefono
                                        SET numero = ?, descripcion = ?
                                        WHERE id = ?`;

                var c = conexion.query(queryTelefono2, [telefono2, descrip_telefono2, id_telefono2], (err, results) => {
                    console.log(c.sql);
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR update telefono2', details: err.message });
                        });
                    }

                    conexion.commit(err => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                            });
                        }
                        res.status(200).json({ message: 'Empleado updated successfully' });
                    });
                });
            });
        });
    });
});

// Endpoint para actualizar datos del cliente
//Funcional
app.put('/cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const { name1, name2, apellido1, apellido2, direccion, correo, nacimiento, telefono1, id_telefono1, descrip_telefono1, telefono2, id_telefono2, descrip_telefono2 } = req.body;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR database transaction', details: err.message });
        }

        const queryPersona = `UPDATE persona
                              SET pnombre = ?, snombre = ?, papellido = ?, sapellido = ?, direccion = ?, correo = ?, fecha_nacimiento = ?
                              WHERE id= ?`;
        var a = conexion.query(queryPersona, [name1, name2, apellido1, apellido2, direccion, correo, nacimiento, clienteId], (err, results) => {
            console.log(a.sql);
            
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR update cliente', details: err.message });
                });
            }

            const queryTelefono1 = `UPDATE telefono
                        SET numero = ?, descripcion = ?
                        WHERE id = ?`;

            var b = conexion.query(queryTelefono1, [telefono1, descrip_telefono1, id_telefono1], (err, results) => {
                console.log(b.sql);
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR update telefono1', details: err.message });
                    });
                }
                
                const queryTelefono2 = `UPDATE telefono
                                        SET numero = ?, descripcion = ?
                                        WHERE id = ?`;

                var c = conexion.query(queryTelefono2, [telefono2, descrip_telefono2, id_telefono2], (err, results) => {
                    console.log(c.sql);
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR update telefono2', details: err.message });
                        });
                    }

                    conexion.commit(err => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR commit transaction', details: err.message });
                            });
                        }
                        res.status(200).json({ message: 'Cliente updated successfully' });
                    });
                });
            });
        });
    });
});

//Endpoint para eliminar los datos de un empleado
//Funcional
app.delete('/empleado/:id', (req, res) => {
    const empleadoId = req.params.id;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR starting transaction', details: err.message });
        }

        // Paso 1: Extraer el persona_id del empleado
        const queryGetPersonaId = `SELECT persona_id FROM empleado WHERE id = ?`;

        conexion.query(queryGetPersonaId, [empleadoId], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR retrieving persona_id', details: err.message });
                });
            }

            if (results.length === 0) {
                return conexion.rollback(() => {
                    res.status(404).json({ error: 'Empleado no encontrado' });
                });
            }

            const personaId = results[0].persona_id;

            // Paso 2: Eliminar todos los teléfonos asociados
            const queryDeleteTelefonos = `
                DELETE FROM telefono 
                WHERE persona_id = ?`;

            conexion.query(queryDeleteTelefonos, [personaId], (err) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR deleting telefonos', details: err.message });
                    });
                }

                // Paso 3: Eliminar el registro del empleado
                const queryDeleteEmpleado = `DELETE FROM empleado WHERE id = ?`;

                conexion.query(queryDeleteEmpleado, [empleadoId], (err) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR deleting empleado', details: err.message });
                        });
                    }

                    // Paso 4: Eliminar la persona asociada
                    const queryDeletePersona = `DELETE FROM persona WHERE id = ?`;

                    conexion.query(queryDeletePersona, [personaId], (err) => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR deleting persona', details: err.message });
                            });
                        }

                        // Confirmar transacción
                        conexion.commit(err => {
                            if (err) {
                                return conexion.rollback(() => {
                                    res.status(500).json({ error: 'ERROR committing transaction', details: err.message });
                                });
                            }

                            res.status(200).json({ message: 'Empleado eliminado exitosamente' });
                        });
                    });
                });
            });
        });
    });
});

//Endpoint para eliminar los datos de un cliente
//Funcional
app.delete('/cliente/:id', (req, res) => {
    const clienteId = req.params.id;

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'ERROR starting transaction', details: err.message });
        }

        // Paso 1: Extraer el persona_id del cliente
        const queryGetPersonaId = `SELECT persona_id FROM cliente WHERE id = ?`;

        conexion.query(queryGetPersonaId, [clienteId], (err, results) => {
            if (err) {
                return conexion.rollback(() => {
                    res.status(500).json({ error: 'ERROR retrieving persona_id', details: err.message });
                });
            }

            if (results.length === 0) {
                return conexion.rollback(() => {
                    res.status(404).json({ error: 'Cliente no encontrado' });
                });
            }

            const personaId = results[0].persona_id;

            // Paso 2: Eliminar todos los teléfonos asociados
            const queryDeleteTelefonos = `
                DELETE FROM telefono 
                WHERE persona_id = ?`;

            conexion.query(queryDeleteTelefonos, [personaId], (err) => {
                if (err) {
                    return conexion.rollback(() => {
                        res.status(500).json({ error: 'ERROR deleting telefonos', details: err.message });
                    });
                }

                // Paso 3: Eliminar el registro del cliente
                const queryDeleteCliente = `DELETE FROM cliente WHERE id = ?`;

                conexion.query(queryDeleteCliente, [clienteId], (err) => {
                    if (err) {
                        return conexion.rollback(() => {
                            res.status(500).json({ error: 'ERROR deleting cliente', details: err.message });
                        });
                    }

                    // Paso 4: Eliminar la persona asociada
                    const queryDeletePersona = `DELETE FROM persona WHERE id = ?`;

                    conexion.query(queryDeletePersona, [personaId], (err) => {
                        if (err) {
                            return conexion.rollback(() => {
                                res.status(500).json({ error: 'ERROR deleting persona', details: err.message });
                            });
                        }

                        // Confirmar transacción
                        conexion.commit(err => {
                            if (err) {
                                return conexion.rollback(() => {
                                    res.status(500).json({ error: 'ERROR committing transaction', details: err.message });
                                });
                            }

                            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
                        });
                    });
                });
            });
        });
    });
});

//Endpoint para obtener los datos de un id en factura
//FUNCIONAL
app.get('/nombre/:tipo/:id', (req, res) => {
    const { tipo, id } = req.params;
    let query = '';
    let params = [id];

    switch(tipo) {
        case 'cliente':
            query = 'SELECT concat(p.pnombre, " ", p.snombre, " ", p.papellido, " ", p.sapellido) as nombre FROM persona p INNER JOIN cliente c ON c.persona_id=p.id WHERE c.id = ?';
            break;
        case 'empleado':
            query = 'SELECT concat(p.pnombre, " ", p.snombre, " ", p.papellido, " ", p.sapellido) as nombre FROM persona p INNER JOIN empleado e ON e.persona_id=p.id WHERE e.id = ?';
            break;
        case 'producto':
            query = 'SELECT p.nombre, l.precio_venta FROM producto p INNER JOIN lote l ON l.producto_id=p.id WHERE p.id = ?';
            break;
        case 'sucursal':
            query = 'SELECT nombre FROM sucursal WHERE id = ?';
            break;
        case 'forma_pago':
            query = 'SELECT forma_pago FROM forma_de_pago WHERE id = ?';
            break;
        default:
            return res.status(400).json({ success: false, message: 'Tipo no válido' });
    }

    conexion.query(query, params, (error, results) => {
        if (error) return res.status(500).json({ success: false, error });
        if (results.length > 0) {
            const { nombre, precio_venta } = results[0];
            res.json({ success: true, nombre, precio_unitario: precio_venta });
        } else {
            res.json({ success: false, message: 'No encontrado' });
        }
    });
});


// Endpoint para obtener la lista de formas de pago
//EN PRUEBA
app.get('/forma_pagos', (req, res) => {
    const query = 'SELECT id, forma_pago FROM forma_de_pago';
    conexion.query(query, (error, results) => {
        if (error) return res.status(500).json({ success: false, error });
        res.json({ forma_pagos: results });
    });
});

//Endpoint para obtener la lista de sucursales
//EN PRUEBA
app.get('/sucursales', (req, res) => {
    const query = 'SELECT id, nombre FROM sucursal';
    conexion.query(query, (error, results) => {
        if (error) return res.status(500).json({ success: false, error });
        res.json({ sucursales: results });
    });
});

// Endpoint para obtener la lista de recargos
app.get('/recargos', (req, res) => {
    const query = 'SELECT id, descripcion, porcentaje FROM recargo';
    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener recargos:', error);
            return res.status(500).json({ success: false, error });
        }
        console.log('Recargos enviados:', results);
        res.json({ recargos: results });
    });
});

// Endpoint para obtener el monto de un recargo específico
app.get('/recargos/:id', (req, res) => {
    const recargoId = req.params.id;
    const query = 'SELECT porcentaje FROM recargo WHERE id = ?';
    conexion.query(query, [recargoId], (error, results) => {
        if (error) {
            console.error('Error al obtener recargo:', error);
            return res.status(500).json({ success: false, error });
        }
        if (results.length > 0) {
            console.log('Recargo encontrado:', results[0]);
            res.json({ success: true, recargo: results[0] });
        } else {
            console.log('Recargo no encontrado para ID:', recargoId);
            res.json({ success: false, message: 'Recargo no encontrado' });
        }
    });
});


// Endpoint para obtener la lista de descuentos
//EN PRUEBA
app.get('/descuentos', (req, res) => {
    const query = 'SELECT id, descripcion, porcentaje FROM descuento';
    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener descuentos:', error);
            return res.status(500).json({ success: false, error });
        }
        console.log('Descuentos enviados:', results);
        res.json({ descuentos: results });
    });
});

// Endpoint para obtener el monto de un descuento específico
//EN PRUEBA
app.get('/descuentos/:id', (req, res) => {
    const descuentoId = req.params.id;
    const query = 'SELECT porcentaje FROM descuento WHERE id = ?';
    conexion.query(query, [descuentoId], (error, results) => {
        if (error) {
            console.error('Error al obtener descuento:', error);
            return res.status(500).json({ success: false, error });
        }
        if (results.length > 0) {
            res.json({ success: true, descuento: results[0] });
        } else {
            res.json({ success: false, message: 'Descuento no encontrado' });
        }
    });
});

// Endpoint para obtener la lista de impuestos
app.get('/impuestos', (req, res) => {
    const query = 'SELECT id, descripcion, porcentaje FROM impuesto';
    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener impuestos:', error);
            return res.status(500).json({ success: false, error });
        }
        console.log('Impuestos enviados:', results);
        res.json({ impuestos: results });
    });
});

// Endpoint para obtener el monto de un impuesto específico
app.get('/impuestos/:id', (req, res) => {
    const impuestoId = req.params.id;
    const query = 'SELECT porcentaje FROM impuesto WHERE id = ?';
    conexion.query(query, [impuestoId], (error, results) => {
        if (error) {
            console.error('Error al obtener impuesto:', error);
            return res.status(500).json({ success: false, error });
        }
        if (results.length > 0) {
            console.log('Impuesto encontrado:', results[0]);
            res.json({ success: true, impuesto: results[0] });
        } else {
            console.log('Impuesto no encontrado para ID:', impuestoId);
            res.json({ success: false, message: 'Impuesto no encontrado' });
        }
    });
});


// Endpoint para obtener el id y la fecha de las facturas
//EN PRUEBA
app.get('/factura_info', (req, res) => {
    const query = 'SELECT MAX(ID) + 1 AS nuevo_id, CURRENT_DATE AS fecha_actual FROM factura';
    
    conexion.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
  });

//Endpoint para obtener los puntos acumulados en una tarjeta
//(Por el mometo se trabaja con el maximo, por cuestion de tiempo)
//EN PRUEBA
app.get('/puntos/:tarjeta_id', (req, res) => {
    const tarjetaId = req.params.tarjeta_id;

    
    const query = 'SELECT MAX(monto) puntos_acumulados FROM movimiento WHERE tarjeta_de_fidelizacion_id=?';

    conexion.query(query, [tarjetaId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({ puntos: results[0].puntos_acumulados });
        } else {
            res.status(404).json({ error: 'Tarjeta no encontrada' });
        }
    });
});


// Endpoint para registrar facturas
//COMPLEJO / EN PRUEBA
// Endpoint para registrar facturas
app.post('/factura', (req, res) => {
    const {
        fecha, tipo_movimiento, sucursal_id, cliente_id, empleado_id, tarjeta_id,
        producto, recargos, descuentos, impuestos, pago_id, puntos, total
    } = req.body;

    console.log('Datos recibidos:', req.body);

    conexion.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'ERROR database transaction', details: err.message });
        }

        // Insertar factura en la tabla 'factura'
        const queryFactura = `
            INSERT INTO factura (fecha, movimiento_id, sucursal_id, cliente_id, empleado_id) 
            VALUES (?, ?, ?, ?, ?)`;

        conexion.query(queryFactura, [fecha, tipo_movimiento, sucursal_id, cliente_id, empleado_id], (err, resultFactura) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return conexion.rollback(() => {
                    res.status(500).json({ success: false, message: 'ERROR insert factura', details: err.message });
                });
            }

            const facturaId = resultFactura.insertId;
            console.log('ID de la factura:', facturaId);

            // Insertar productos en la tabla 'factura_tiene_producto'
            const queryProducto = `
                INSERT INTO factura_tiene_producto (cantidad, producto_id, factura_id) 
                VALUES (?, ?, ?)`;

            let productErrors = false;
            producto.forEach((p, index) => {
                conexion.query(queryProducto, [p.cantidad, p.producto_id, facturaId], (err) => {
                    if (err && !productErrors) {
                        productErrors = true;
                        return conexion.rollback(() => {
                            res.status(500).json({ success: false, message: 'ERROR insert producto', details: err.message });
                        });
                    }
                    console.log('Producto insertado:', { facturaId, producto_id: p.producto_id, cantidad: p.cantidad });
                    if (index === producto.length - 1 && !productErrors) {

                        // Lógica para acumular o utilizar puntos
                        if (tipo_movimiento === "1") {
                            // Acumula puntos
                            let puntosAdicionales = 0;
                            if (total < 1000) {
                                puntosAdicionales = 10;
                            } else if (total >= 1000 && total <= 2000) {
                                puntosAdicionales = 15;
                            } else if (total > 2000) {
                                puntosAdicionales = 30;
                            }

                            puntosFinales = parseInt(puntos) + puntosAdicionales;

                            const queryAcumulaPuntos = `
                                UPDATE movimiento
                                SET monto = monto + ? , fecha= CURRENT_DATE
                                WHERE tipo_movimiento= 'A' AND tarjeta_de_fidelizacion_id = ?`;

                            conexion.query(queryAcumulaPuntos, [puntosAdicionales, tarjeta_id], (err) => {
                                if (err) {
                                    return conexion.rollback(() => {
                                        res.status(500).json({ success: false, message: 'ERROR update acumula_puntos', details: err.message });
                                    });
                                }
                                console.log('Puntos acumulados actualizados:', { tarjeta_id, puntosAdicionales });

                                const queryAcumulaPuntos2 = `
                                    INSERT INTO movimiento ( fecha, tipo_movimiento, monto, tarjeta_de_fidelizacion_id) VALUES (?, ?, ?, ?)`;

                                conexion.query(queryAcumulaPuntos2, [fecha, 'U', 0, tarjeta_id], (err) => {
                                    if (err) {
                                        return conexion.rollback(() => {
                                            res.status(500).json({ success: false, message: 'ERROR insert movimiento utiliza 0 puntos', details: err.message });
                                        });
                                    }
                                    console.log('Utiliza 0 puntos agregado:', { fecha, tarjeta_id });
                                });
                            });

                        } else if (tipo_movimiento === "2") {
                            // Utiliza puntos
                            const puntosAUsar = puntos; // Cantidad de puntos que se va a utilizar
                            
                            const queryRestaPuntos = `
                                UPDATE movimiento
                                SET monto = monto - ? , fecha = CURRENT_DATE
                                WHERE tipo_movimiento= 'A' AND tarjeta_de_fidelizacion_id = ?`;

                            conexion.query(queryRestaPuntos, [puntosAUsar, tarjeta_id], (err) => {
                                if (err) {
                                    return conexion.rollback(() => {
                                        res.status(500).json({ success: false, message: 'ERROR update resta_puntos', details: err.message });
                                    });
                                }
                                console.log('Puntos restados actualizados:', { tarjeta_id, puntosAUsar });

                                const queryUsoPuntos = `
                                    INSERT INTO movimiento (fecha, tipo_movimiento, monto, tarjeta_de_fidelizacion_id) VALUES (?, ?, ?, ?)`;

                                conexion.query(queryUsoPuntos, [fecha, 'U', puntosAUsar, tarjeta_id], (err) => {
                                    if (err) {
                                        return conexion.rollback(() => {
                                            res.status(500).json({ success: false, message: 'ERROR insert uso_puntos', details: err.message });
                                        });
                                    }
                                    console.log('Uso de puntos agregado:', { fecha, tarjeta_id, puntosAUsar });
                                });
                            });
                        }
                         // Insertar forma de pago
                        const queryFormaPago = `
                            INSERT INTO factura_tiene_forma_de_pago (monto_pago, forma_de_pago_id, factura_id) 
                            VALUES (?, ?, ?)`;

                        conexion.query(queryFormaPago, [total, pago_id, facturaId], (err) => {
                            if (err) {
                                return conexion.rollback(() => {
                                    res.status(500).json({ success: false, message: 'ERROR insert forma de pago', details: err.message });
                                });
                            }
                            console.log('Forma de pago insertada:', { facturaId, pago_id, total });

                            // Insertar recargos
                            const queryRecargo = `
                                INSERT INTO factura_tiene_recargo (factura_id, recargo_id) 
                                VALUES (?, ?)`;

                            let recargoErrors = false;
                            recargos.forEach((r, index) => {
                                conexion.query(queryRecargo, [facturaId, r.recargo_id], (err) => {
                                    if (err && !recargoErrors) {
                                        recargoErrors = true;
                                        return conexion.rollback(() => {
                                            res.status(500).json({ success: false, message: 'ERROR insert recargo', details: err.message });
                                        });
                                    }
                                    console.log('Recargo insertado:', { facturaId, recargo_id: r.recargo_id });

                                    if (index === recargos.length - 1 && !recargoErrors) {
                                        // Insertar descuentos
                                        const queryDescuento = `
                                            INSERT INTO factura_tiene_descuento (factura_id, descuento_id) 
                                            VALUES (?, ?)`;

                                        let descuentoErrors = false;
                                        descuentos.forEach((d, index) => {
                                            conexion.query(queryDescuento, [facturaId, d.descuento_id], (err) => {
                                                if (err && !descuentoErrors) {
                                                    descuentoErrors = true;
                                                    return conexion.rollback(() => {
                                                        res.status(500).json({ success: false, message: 'ERROR insert descuento', details: err.message });
                                                    });
                                                }
                                                console.log('Descuento insertado:', { facturaId, descuento_id: d.descuento_id });

                                                if (index === descuentos.length - 1 && !descuentoErrors) {
                                                    // Insertar impuestos
                                                    const queryImpuesto = `
                                                        INSERT INTO factura_tiene_impuesto (factura_id, impuesto_id) 
                                                        VALUES (?, ?)`;

                                                    let impuestoErrors = false;
                                                    impuestos.forEach((i, index) => {
                                                        conexion.query(queryImpuesto, [facturaId, i.impuesto_id], (err) => {
                                                            if (err && !impuestoErrors) {
                                                                impuestoErrors = true;
                                                                return conexion.rollback(() => {
                                                                    res.status(500).json({ success: false, message: 'ERROR insert impuesto', details: err.message });
                                                                });
                                                            }
                                                            console.log('Impuesto insertado:', { facturaId, impuesto_id: i.impuesto_id });

                                                            if (index === impuestos.length - 1 && !impuestoErrors) {
                                                                // Insertar entrada en la tabla 'entrada_salida'
                                                                const querySalida = `
                                                                    INSERT INTO entrada_salida (fecha, tipo, sucursal_id, empleado_id) 
                                                                    VALUES (?, ?, ?, ?)`;

                                                                conexion.query(querySalida, [fecha, 'S', sucursal_id, empleado_id], (err, resultSalida) => {
                                                                    if (err) {
                                                                        return conexion.rollback(() => {
                                                                            res.status(500).json({ success: false, message: 'ERROR insert entrada_salida', details: err.message });
                                                                        });
                                                                    }

                                                                    const salidaId = resultSalida.insertId;
                                                                    console.log('ID de salida:', salidaId);

                                                                    // Insertar productos en 'producto_tiene_entrada_o_salida'
                                                                    const querySalidaProducto = `
                                                                        INSERT INTO producto_tiene_entrada_o_salida (cantidad, producto_id, entrada_salida_id) 
                                                                        VALUES (?, ?, ?)`;

                                                                    let salidaProductoErrors = false;
                                                                    producto.forEach((p, index) => {
                                                                        conexion.query(querySalidaProducto, [p.cantidad, p.producto_id, salidaId], (err) => {
                                                                            if (err && !salidaProductoErrors) {
                                                                                salidaProductoErrors = true;
                                                                                return conexion.rollback(() => {
                                                                                    res.status(500).json({ success: false, message: 'ERROR insert producto_tiene_entrada_o_salida', details: err.message });
                                                                                });
                                                                            }
                                                                            console.log('Producto en salida insertado:', { cantidad: p.cantidad, producto_id: p.producto_id, salidaId });

                                                                            if (index === producto.length - 1 && !salidaProductoErrors) {
                                                                                // Actualizar existencia en la tabla 'lote'
                                                                                const queryLote = `
                                                                                    UPDATE lote
                                                                                    SET existencia = existencia - ?
                                                                                    WHERE producto_id = ?`;

                                                                                let loteErrors = false;
                                                                                producto.forEach((p, index) => {
                                                                                    conexion.query(queryLote, [p.cantidad, p.producto_id], (err) => {
                                                                                        if (err && !loteErrors) {
                                                                                            loteErrors = true;
                                                                                            return conexion.rollback(() => {
                                                                                                res.status(500).json({ success: false, message: 'ERROR update lote', details: err.message });
                                                                                            });
                                                                                        }
                                                                                        console.log('Existencia del lote actualizada:', { producto_id: p.producto_id, cantidad: p.cantidad });

                                                                                        if (index === producto.length - 1 && !loteErrors) {
                                                                                            // Commit de la transacción
                                                                                            conexion.commit(err => {
                                                                                                if (err) {
                                                                                                    return conexion.rollback(() => {
                                                                                                        res.status(500).json({ success: false, message: 'ERROR commit transaction', details: err.message });
                                                                                                    });
                                                                                                }
                                                                                                res.status(201).json({ success: true, message: 'Factura registrada exitosamente', puntosFinales });
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
            });
        });
    });
});




// Función auxiliar para manejar promesas en consultas SQL
function queryPromise(connection, query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}




app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
