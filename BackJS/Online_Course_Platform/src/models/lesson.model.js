module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lesson', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'Video URL must be a valid URL'
                }
            }
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Duration must be greater than 0'
                }
            }
        },
        
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Order must be 1 or greater'
                }
            }
        },
        
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id'
            },
            onDelete: 'CASCADE'               
        }
    }, {
        tableName: 'lessons',
        timestamps: true,
        
        indexes: [
            {
                unique: true,
                fields: ['courseId', 'order']
            }
        ]
    });

    return Lesson;
};