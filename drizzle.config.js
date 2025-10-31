// @type{ import ("drizzle-kit").Config}
export default{
    schema:"./src/config/schema.js",
    dialect:'postgresql',
    dbCredentials:{
     url:"postgresql://neondb_owner:npg_5ZBgmfRiclo0@ep-still-dream-a8dr4xiz.eastus2.azure.neon.tech/AiProject?sslmode=require"
    }
}