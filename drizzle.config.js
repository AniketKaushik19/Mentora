// @type{ import ("drizzle-kit").Config}
export default{
    schema:"./config/schema.js",
    dialect:'postgresql',
    dbCredentials:{
     url:"postgresql://neondb_owner:npg_nRakLtpd41Uu@ep-winter-snow-adp8e299-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
}