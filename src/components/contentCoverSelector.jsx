import React, { useState, useRef, useEffect } from 'react';
import '../styles/contentCoverSelector.css';

export default function ImageSelector ({ src, radius, setRadius, selection, setSelection }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    // Dimensioni originali dell'immagine
    const originalImageDimensions = { width: 250, height: 375 };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = imageRef.current;

        if (imageLoaded && canvas) {
            // Pulisci il canvas prima di disegnare
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calcola il rapporto di scala per mantenere le proporzioni dell'immagine
            const scaleX = canvas.width / originalImageDimensions.width;
            const scaleY = canvas.height / originalImageDimensions.height;
            const scale = Math.min(scaleX, scaleY);

            const imgWidth = originalImageDimensions.width * scale;
            const imgHeight = originalImageDimensions.height * scale;

            // Centra l'immagine nel canvas
            const offsetX = (canvas.width - imgWidth) / 2;
            const offsetY = (canvas.height - imgHeight) / 2;

            // Disegna l'immagine ridimensionata
            context.drawImage(image, offsetX, offsetY, imgWidth, imgHeight);

            // Se c'è una selezione, disegna il cerchio
            if (selection) {
                context.beginPath();
                context.arc(
                    offsetX + selection.x * scale,
                    offsetY + selection.y * scale,
                    radius * scale,
                    0,
                    2 * Math.PI
                );
                context.strokeStyle = 'black';
                context.lineWidth = 2;
                context.stroke();
            }
        }

    }, [imageLoaded, selection, radius, src]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Calcola le coordinate cliccate rispetto al canvas
        const scaleX = originalImageDimensions.width / canvas.width;
        const scaleY = originalImageDimensions.height / canvas.height;
        const scale = Math.min(scaleX, scaleY);

        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);

        // Inverso del ridimensionamento, per ottenere coordinate nell'immagine originale
        const offsetX = (canvas.width - originalImageDimensions.width * scale) / 2;
        const offsetY = (canvas.height - originalImageDimensions.height * scale) / 2;

        const scaledX = (x - offsetX) / scale;
        const scaledY = (y - offsetY) / scale;

        setSelection({ x: scaledX, y: scaledY });
    };

    const handleRadiusChange = (e) => {
        setRadius(parseInt(e.target.value, 10));
    };

    return (
        <div className="contentCoverSelector">
            <h3>Seleziona un'Immagine da uno dei film nella lista accanto e Modificala!</h3>
            <canvas
                ref={canvasRef}
                width={originalImageDimensions.width}
                height={originalImageDimensions.height}
                onClick={handleCanvasClick}
                style={{border: '1px solid black', cursor: 'crosshair'}}
            />
            <img
                ref={imageRef}
                src={src}
                alt="Source"
                style={{ display: 'none' }}
                onLoad={handleImageLoad}
            />

            <div>
                <label htmlFor="radius">Dimensione del cerchio: </label>
                <input
                    type="range"
                    id="radius"
                    min="40"
                    max="120"
                    value={radius}
                    onChange={handleRadiusChange}
                />
                <span>{radius}px</span>
            </div>

        </div>
    );
};