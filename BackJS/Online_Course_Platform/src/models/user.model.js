module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: {
                    args: [2, 100],
                    msg: 'Full name must be between 2 and 100 characters'
                }
            }
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6],
                    msg: 'Password must be at least 6 characters'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'instructor', 'student'),
            defaultValue: 'student',
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    return User;
};
