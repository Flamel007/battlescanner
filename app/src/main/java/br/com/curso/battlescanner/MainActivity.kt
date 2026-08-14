package br.com.curso.battlescanner

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.common.InputImage
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.concurrent.Executors

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BattleScannerTheme {
                ScannerApp()
            }
        }
    }
}

/**
 * Tema gamer escuro para o visor
 */
@Composable
fun BattleScannerTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFF00E676), // Verde Neon
            secondary = Color(0xFF00B0FF),
            background = Color(0xFF0A0A0A)
        ),
        content = content
    )
}

/**
 * Gerenciador reativo de permissão
 */
@Composable
fun ScannerApp() {
    val context = LocalContext.current
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    // Registra callback de resposta da permissão
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted ->
            hasCameraPermission = granted
        }
    )

    // Lança a solicitação ao iniciar
    LaunchedEffect(key1 = true) {
        if (!hasCameraPermission) {
            launcher.launch(Manifest.permission.CAMERA)
        }
    }

    if (hasCameraPermission) {
        ScannerScreen()
    } else {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Permissão de Câmera Necessária para Jogar",
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = { launcher.launch(Manifest.permission.CAMERA) }) {
                    Text("Conceder Permissão")
                }
            }
        }
    }
}

/**
 * Tela do Scanner e Painéis de Estado
 */
@Composable
fun ScannerScreen() {
    var scanResult by remember { mutableStateOf("Aponte para um QR Code") }
    var isBattleStarted by remember { mutableStateOf(false) }
    // Enquanto true, novas detecções são ignoradas — evita reiniciar a batalha
    // instantaneamente após "Fugir" (o QR ainda está na frente da câmera)
    var scanningPaused by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        // Renderizador físico do visor da câmera
        CameraPreview(onBarcodeDetected = { code ->
            if (!scanningPaused) {
                scanResult = code
                if (code == "POKE_BATTLE") {
                    isBattleStarted = true
                }
            }
        })

        // Mira Flutuante do Leitor (Muda de cor conforme o estado do leitor)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(60.dp)
                .border(2.dp, if (isBattleStarted) Color.Red else Color(0xFF00E676), RoundedCornerShape(24.dp)),
            contentAlignment = Alignment.Center
        ) {
            if (isBattleStarted) {
                Text(
                    "BATALHA INICIADA!",
                    color = Color.Red,
                    fontWeight = FontWeight.Black,
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center
                )
            } else {
                Text(
                    "SCANNER ATIVO",
                    color = Color(0xFF00E676),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
        }

        // Painel Inferior de Informação e Ações
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(Color.Black.copy(alpha = 0.7f))
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("STATUS DO SCANNER", fontSize = 12.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = scanResult,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = if (isBattleStarted) Color.Red else Color.White,
                textAlign = TextAlign.Center
            )

            // Exibe botão de fuga caso a batalha tenha sido acionada
            if (isBattleStarted) {
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        isBattleStarted = false
                        scanResult = "Aponte para um QR Code"
                        // Pausa a detecção por 2s para dar tempo do jogador afastar
                        // a câmera do QR code; sem isso, a batalha reiniciaria no próximo frame
                        scanningPaused = true
                        coroutineScope.launch {
                            delay(2000)
                            scanningPaused = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
                ) {
                    Text("FUGIR DA BATALHA", color = Color.White)
                }
            }
        }
    }
}

/**
 * Inicialização e Acoplamento da CâmeraX
 */
@Composable
fun CameraPreview(onBarcodeDetected: (String) -> Unit) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }
    // Içado para fora do factory (que só roda uma vez) para poder ser fechado no onDispose
    val barcodeScanner = remember { BarcodeScanning.getClient() }

    // Encerra o executor e libera o detector do ML Kit ao sair da tela, evitando leaks
    DisposableEffect(Unit) {
        onDispose {
            cameraExecutor.shutdown()
            barcodeScanner.close()
        }
    }

    AndroidView(
        factory = { ctx ->
            val previewView = PreviewView(ctx)
            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

            cameraProviderFuture.addListener({
                val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()

                // 1. Configura Caso de Uso de Visualização
                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }

                // 2. Configura Analisador Inteligente de Imagem (ML Kit)
                // (barcodeScanner é o remember hoisted acima, fechado em onDispose)
                val imageAnalysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build()
                    .also {
                        it.setAnalyzer(cameraExecutor) { imageProxy ->
                            processImageProxy(barcodeScanner, imageProxy, onBarcodeDetected)
                        }
                    }

                // 3. Escolhe Câmera Traseira Padrão
                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                try {
                    cameraProvider.unbindAll() // Reseta vinculações anteriores
                    cameraProvider.bindToLifecycle(
                        lifecycleOwner,
                        cameraSelector,
                        preview,
                        imageAnalysis
                    )
                } catch (exc: Exception) {
                    Log.e("CameraPreview", "Use case binding failed", exc)
                }

            }, ContextCompat.getMainExecutor(ctx))

            previewView
        },
        modifier = Modifier.fillMaxSize()
    )
}

/**
 * Função Auxiliar de Descriptografia e Processamento do Frame
 */
@androidx.annotation.OptIn(ExperimentalGetImage::class)
private fun processImageProxy(
    barcodeScanner: com.google.mlkit.vision.barcode.BarcodeScanner,
    imageProxy: ImageProxy,
    onBarcodeDetected: (String) -> Unit
) {
    val mediaImage = imageProxy.image
    if (mediaImage != null) {
        // Converte o Frame do CameraX no formato esperado pelo ML Kit
        val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
        barcodeScanner.process(image)
            .addOnSuccessListener { barcodes ->
                for (barcode in barcodes) {
                    val rawValue = barcode.rawValue
                    if (rawValue != null) {
                        onBarcodeDetected(rawValue)
                    }
                }
            }
            .addOnFailureListener {
                Log.e("QRAnalyzer", "Scan failed", it)
            }
            .addOnCompleteListener {
                // MUITO CRÍTICO: Libera o proxy de frame de vídeo para permitir nova captura!
                imageProxy.close()
            }
    } else {
        imageProxy.close()
    }
}
