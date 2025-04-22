
document.addEventListener("DOMContentLoaded", () => {
    const years = [2010, 2012, 2014, 2016, 2018, 2020];
    const escolaridad = [4.5, 4.9, 5.3, 5.6, 6.0, 6.3];

    const n = years.length;
    const X = years;
    const Y = escolaridad;

    const xMatrix = [];
    for (let i = 0; i < n; i++) {
        xMatrix.push([1, X[i], X[i] * X[i]]);
    }

    const xT = math.transpose(xMatrix);
    const xTx = math.multiply(xT, xMatrix);
    const xTy = math.multiply(xT, Y);
    const coef = math.lusolve(xTx, xTy).flat();

    const [c, b, a] = coef;
    const Y_pred = X.map(x => a * x * x + b * x + c);

    const ssRes = Y.reduce((sum, y, i) => sum + Math.pow(y - Y_pred[i], 2), 0);
    const meanY = math.mean(Y);
    const ssTot = Y.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    document.getElementById("regression-results").innerHTML = `
        <strong>Ecuación:</strong> y = ${a.toFixed(4)}x² + ${b.toFixed(4)}x + ${c.toFixed(4)}<br>
        <strong>R²:</strong> ${rSquared.toFixed(4)}
    `;

    document.getElementById("regression-conclusion").textContent = 
        rSquared > 0.9 
            ? "El modelo polinomial se ajusta muy bien a los datos (R² alto)." 
            : "El modelo tiene un ajuste moderado, podrías considerar más datos.";

    new Chart(document.getElementById("regression-chart").getContext("2d"), {
        type: 'scatter',
        data: {
            labels: X,
            datasets: [
                {
                    label: 'Datos Reales',
                    data: X.map((x, i) => ({ x, y: Y[i] })),
                    backgroundColor: 'blue'
                },
                {
                    label: 'Modelo Polinomial',
                    data: X.map((x, i) => ({ x, y: Y_pred[i] })),
                    type: 'line',
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Año' } },
                y: { title: { display: true, text: 'Escolaridad Promedio' } }
            }
        }
    });
});
