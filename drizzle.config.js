// @type{ import ("drizzle-kit").Config}
export default{
    schema:"./src/config/schema.js",
    dialect:'postgresql',
    dbCredentials:{
     url:"postgresql://neondb_owner:npg_vtqdX5BlW3iK@ep-rough-union-ad460x3o.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
}