<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-[350px] max-w-[500px]">
            <h3>Sign Up</h3>
            <form @submit.prevent="signUp">
                <div class="mb-6">
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                    <input type="username" id="username" v-model="username"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="name" required>
                </div>
                <div class="mb-6">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                    <input type="email" id="email" v-model="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="name@example.com" required>
                </div>
                <div class="mb-6">
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                    <input type="password" id="password" v-model="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required>
                </div>
                <button type="submit"
                    class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            username: '',
            email: '',
            password: ''
        };
    },
    methods: {
        async signUp() {
            console.log('username:', this.username);
            console.log('Email:', this.email);
            console.log('Password:', this.password);
            try {
                const response = await axios.post('http://localhost:3000/auth/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                });

                console.log('Server response:', response.data);
                alert('Success')
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(error)
            }
        }
    }
}
</script>

<style scoped></style>