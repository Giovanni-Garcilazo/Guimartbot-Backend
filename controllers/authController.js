const db = require('../db/connection');
const redirectUrl = '/login'; // URL de redirección después del registro

// Función de registro
exports.register = (req, res) => {
    const { username, password, email, birthdate } = req.body;
    
    // Calcular la edad
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    
    // Ajuste para la edad si el cumpleaños aún no ha llegado este año
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    // Validar la edad mínima para el registro
    if (age < 5) {
        return res.status(400).json({
            error: 'Lo sentimos, debes tener al menos 5 años para registrarte'
        });
    }

    db.query(
        'INSERT INTO users (username, password, email, birthdate) VALUES (?, ?, ?, ?)', 
        [username, password, email, birthdate], 
        (err, result) => {
            if (err) {
                console.error('Error en la inserción:', err);
                return res.status(500).json({
                    error: 'Error en el registro'
                });
            }
            
            res.json({ 
                message: 'Usuario registrado exitosamente',
                redirectUrl: redirectUrl
            });
        }
    );
};

// Función de login
exports.login = (req, res) => {
    const { username, password, roleKey } = req.body; // Incluimos roleKey en la solicitud

    db.query('SELECT *, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) as age FROM users WHERE username = ? AND password = ?', 
    [username, password], 
    (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el inicio de sesión' });
        }
        
        if (results.length > 0) {
            const user = results[0];
            const age = user.age;
            let redirectUrl;

            // Verificar si el usuario es administrador y si el roleKey es correcto
            if (user.role === 'admin') {
                if (user.roleKey !== roleKey) {
                    return res.status(401).json({ error: 'RoleKey incorrecto' });
                }
                redirectUrl = '/Guimartbot-dashboard'; // Redirigir al dashboard de admin
            } else {
                // Aquí ya no hay redirección por edad, puedes colocar una URL estática o eliminar el bloque.
                redirectUrl = '/Ingreso-usuario.html'; // Ejemplo de URL estática para todos los usuarios
            }

            res.json({ 
                message: 'Inicio de sesión exitoso',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    age: age
                },
                redirectUrl: redirectUrl
            });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
};
