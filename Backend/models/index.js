// const dbConfig = require('../config/dbconfig');
// require('dotenv').config();
// const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       dialect: 'postgres',
//       logging: false,
//       pool: {
//         max: Number(process.env.DB_POOL_MAX)  || 5,
//         min: Number(process.env.DB_POOL_MIN)  || 0,
//         acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
//         idle: Number(process.env.DB_POOL_IDLE)     || 10000
//       }
//     }
//   );


// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// const Tile_Type = sequelize.define('Tile_Type', {
//     tile_type_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     tile_type_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

// const Tile_Sizes = sequelize.define('Tile_Sizes', {
//     tile_size_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     tile_size_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

// const Tile = sequelize.define('Tile', {
//     tile_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     tile_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     tile_photo: {
//         type: DataTypes.JSONB,
//         allowNull: false
//     }
// });


// Tile.hasMany(Tile_Type, { foreignKey: 'tile_type_id' });
// Tile.hasMany(Tile_Sizes, { foreignKey: 'tile_size_id' });

// Tile.belongsTo(Tile_Type, { foreignKey: 'tile_type_id' });
// Tile.belongsTo(Tile_Sizes, { foreignKey: 'tile_size_id' });

// sequelize.sync()
//     .then(() => {
//       console.log('All models were synchronized successfully.');
//     })
//     .catch(err => {
//       console.error('An error occurred while synchronizing the models:', err);
//     });

// module.exports = {
//     Tile,
//     Tile_Type,
//     Tile_Sizes
// };

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: Number(process.env.DB_POOL_MIN) || 0,
      acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: Number(process.env.DB_POOL_IDLE) || 10000
    }
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => console.log('Database connection established.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Define Tile Types
const TileType = sequelize.define('Tile_Type', {
  tile_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tile_type_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'tile_types',
  timestamps: true
});

// Define Tile Sizes
const TileSize = sequelize.define('Tile_Sizes', {
  tile_size_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tile_size_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'tile_sizes',
  timestamps: true
});

// Define Tiles
const Tile = sequelize.define('Tile', {
  tile_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tile_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tile_photo: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  tile_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TileType,
      key: 'tile_type_id'
    }
  },
  tile_size_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TileSize,
      key: 'tile_size_id'
    }
  }
}, {
  tableName: 'tiles',
  timestamps: true
});

const Sanitary_Ware = sequelize.define('Sanitary_Ware', {
    sanitary_ware_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sanitary_ware_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sanitary_ware_photo: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'sanitary_wares',
    timestamps: true
});

const Sanitary_Type = sequelize.define('Sanitary_Type', {
  sanitary_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sanitary_type_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'sanitary_types',
  timestamps: true
});

const Brochure = sequelize.define('Brochure', {
    brochure_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brochure_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brochure_pdf: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'brochures',
    timestamps: true
})

// Associations
TileType.hasMany(Tile, { foreignKey: 'tile_type_id' });
TileSize.hasMany(Tile, { foreignKey: 'tile_size_id' });
Tile.belongsTo(TileType, { foreignKey: 'tile_type_id' });
Tile.belongsTo(TileSize, { foreignKey: 'tile_size_id' });

// Sync models with database
sequelize.sync()
  .then(() => console.log('All models synchronized successfully.'))
  .catch(err => console.error('Error synchronizing models:', err));

// Export models and sequelize instance
module.exports = {
  sequelize,
  Tile,
  TileType,
  TileSize,
  Sanitary_Ware,
  Sanitary_Type,
  Brochure
};
