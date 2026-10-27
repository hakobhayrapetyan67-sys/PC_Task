module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define('Enrollment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        
        status: {
            type: DataTypes.ENUM('active', 'completed', 'cancelled'),
            defaultValue: 'active',
            allowNull: false
        },
       progress: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'Progress cannot be less than 0'
                },
                max: {
                    args: [100],
                    msg: 'Progress cannot be greater than 100'
                }
            }
        },
        enrolledAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'enrollments',
        timestamps: true,
        
        indexes: [
            {
                unique: true,
                fields: ['userId', 'courseId']
            }
        ]
    });

    return Enrollment;
};