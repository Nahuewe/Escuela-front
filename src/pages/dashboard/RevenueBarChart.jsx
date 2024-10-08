import React, { useRef, useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import useDarkMode from '@/hooks/useDarkMode'
import useRtl from '@/hooks/useRtl'
import Card from '@/components/ui/Card'
import * as htmlToImage from 'html-to-image'

const RevenueBarChart = ({ afiliadosSinPaginar, height = 400 }) => {
  const chartRef = useRef(null)
  const [isDark] = useDarkMode()
  const [isRtl] = useRtl()
  const [series, setSeries] = useState([])
  const [totalData, setTotalData] = useState(0)
  const [topFormacion, setTopFormacion] = useState('')

  useEffect(() => {
    if (afiliadosSinPaginar && afiliadosSinPaginar.length > 0) {
      const formaciones = {}

      // Contar las formaciones
      afiliadosSinPaginar.forEach(afiliado => {
        afiliado.formacion.forEach(f => {
          if (formaciones[f.formacion]) {
            formaciones[f.formacion] += 1
          } else {
            formaciones[f.formacion] = 1
          }
        })
      })

      const totalAfiliados = afiliadosSinPaginar.reduce(
        (total, afiliado) => total + afiliado.formacion.length,
        0
      )

      // Crear los datos de la serie
      const seriesData = Object.keys(formaciones).map(formacion => ({
        name: formacion,
        data: [(formaciones[formacion] / totalAfiliados) * 100]
      }))

      // Encontrar la formación con mayor porcentaje
      const topFormacion = Object.keys(formaciones).reduce((prev, curr) =>
        formaciones[curr] > formaciones[prev] ? curr : prev
      )

      setSeries(seriesData)
      setTotalData(totalAfiliados)
      setTopFormacion(topFormacion)
    }
  }, [afiliadosSinPaginar])

  const options = {
    chart: {
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        endingShape: 'rounded',
        columnWidth: '45%'
      }
    },
    title: {
      text: 'Porcentaje de Alumnos Por Formación',
      align: 'left',
      offsetX: isRtl ? '0%' : 0,
      offsetY: 13,
      floating: false,
      style: {
        fontSize: '20px',
        fontWeight: '500',
        fontFamily: 'Inter',
        color: isDark ? '#fff' : '#0f172a'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    yaxis: {
      opposite: !!isRtl,
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter'
        }
      }
    },
    xaxis: {
      categories: ['Porcentaje de Formaciones'],
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2) + '%'
        }
      },
      theme: isDark ? 'dark' : 'light'
    },
    legend: {
      labels: {
        colors: isDark ? '#ffffff' : '#000000'
      }
    },
    colors: [
      '#4669FA', '#0CE7FA', '#FA916B', '#51BB25', '#FFD500',
      '#FF7A00', '#7C3AED', '#34B3EB', '#FF5247', '#33CC33',
      '#FFA07A', '#00FFFF', '#C0C0C0', '#808080', '#FF0000',
      '#800000', '#FFFF00', '#808000', '#00FF00', '#008000',
      '#00FFFF', '#008080', '#0000FF', '#000080', '#FF00FF',
      '#800080'
    ],
    grid: {
      show: true,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      strokeDashArray: 10,
      position: 'back'
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 8,
            horizontalAlign: 'center'
          },
          plotOptions: {
            bar: {
              columnWidth: '80%'
            }
          }
        }
      }
    ]
  }

  const downloadChart = () => {
    if (chartRef.current) {
      htmlToImage.toPng(chartRef.current)
        .then(function (dataUrl) {
          const link = document.createElement('a')
          link.download = 'PorcentajeAlumnosPorFormacion.png'
          link.href = dataUrl
          link.click()
        })
    }
  }

  return (
    <Card>
      <div className={`flex justify-end ${isDark ? 'dark' : ''}`}>
        <button className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} onClick={downloadChart}>Descargar</button>
      </div>
      <div ref={chartRef}>
        <Chart options={options} series={series} type='bar' height={height} />
        <div className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} style={{ textAlign: 'center', marginTop: '10px' }}>
          Total de Formaciones Cursadas: {totalData}
        </div>
        <div className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} style={{ textAlign: 'center', marginTop: '10px' }}>
          Formación Más Cursada: {topFormacion}
        </div>
      </div>
    </Card>
  )
}

export default RevenueBarChart
