export const up = (queryInterface: any, Sequelize: any) => queryInterface.createTable('Users', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  deletedAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

export const down = (queryInterface: any, Sequelize: any) => queryInterface.dropTable('Users');
