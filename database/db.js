import mongoose from 'mongoose'

const Connection = async () => {
    const URL = process.env.URL;
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
    }
}

export default Connection