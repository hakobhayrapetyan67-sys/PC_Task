module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Title must be between 3 and 150 characters'
                }
            }
        },
        
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        
        level: {
            type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            defaultValue: 'beginner',
            allowNull: false
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),    // 10 նիշ, 2-ը՝ կոպեկներ
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: 'Price must be 0 or greater'
                }
            }
        },

        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',                 // աղյուսակի անունը
                key: 'id'
            },
            onDelete: 'CASCADE'                 // եթե user-ը ջնջվի, course-երը նույնպես
        }
    }, {
        tableName: 'courses',
        timestamps: true
    });

    return Course;
};