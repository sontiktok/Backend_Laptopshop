<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-[350px] max-w-[500px]">
            <form @submit.prevent="login">
                <div class="mb-6">
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Your username</label>
                    <input type="text" id="username" v-model="username"
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
            password: ''
        };
    },
    methods: {
        async login() {
            console.log('username:', this.username);
            console.log('Password:', this.password);
            try {
                const response = await axios.post('http://localhost:3000/auth/login', {
                    username: this.username,
                    password: this.password
                });
                console.log('Server response:', response.data);
                const result = response.data;
                console.log('====================================');
                console.log(result['massage']);
                console.log('====================================');
                if (result['success']) {
                    localStorage.setItem('token', result['token'])
                }
                this.$router.push('/');

            } catch (error) {
                console.error('Error :', error);
            }
        }
    }
}
</script>

<style scoped></style>