#!/usr/bin/env node

const http = require('http');
const https = require('https');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5134/api';

console.log('🔍 Verificando conectividade com o backend...');
console.log(`📍 URL: ${API_BASE_URL}`);

// Extrair protocolo, host e porta da URL
const url = new URL(API_BASE_URL);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

// Endpoints para testar
const endpoints = [
  '/health',
  '/',
  '/auth/login',
  ''
];

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    const urlObj = new URL(fullUrl);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TakeCerto-Frontend-Check'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          endpoint,
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500), // Limitar dados para não poluir o log
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint,
        success: false,
        error: 'Timeout (5s)'
      });
    });

    req.end();
  });
}

async function main() {
  console.log('\n📋 Testando endpoints...\n');
  
  let anySuccess = false;
  
  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint);
    
    if (result.success) {
      console.log(`✅ ${endpoint || '/'}: ${result.status}`);
      if (result.data) {
        console.log(`   Resposta: ${result.data.substring(0, 100)}${result.data.length > 100 ? '...' : ''}`);
      }
      anySuccess = true;
    } else {
      console.log(`❌ ${endpoint || '/'}: ${result.error || 'Erro desconhecido'}`);
    }
  }
  
  console.log('\n📊 Resultado:');
  
  if (anySuccess) {
    console.log('✅ Backend está acessível!');
    console.log('💡 Se ainda há problemas no frontend, verifique:');
    console.log('   - CORS configurado para http://localhost:3000');
    console.log('   - Estrutura da resposta do endpoint /auth/login');
    console.log('   - Logs do console no navegador');
  } else {
    console.log('❌ Backend não está acessível');
    console.log('💡 Soluções:');
    console.log('   1. Verifique se o backend está rodando');
    console.log('   2. Confirme a URL e porta no .env.local');
    console.log('   3. Verifique se o CORS está configurado para http://localhost:3000');
    console.log('   4. Teste manualmente: curl http://localhost:5134/api/health');
  }

  console.log('\n🔧 Configuração atual:');
  console.log(`   NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}`);
}

main().catch(console.error);
