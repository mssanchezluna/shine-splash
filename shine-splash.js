(function() {
if (window.top !== window) return;
if (window.__shineSplash) return;
window.__shineSplash = true;
var DEMO = !!window.SHINE_DEMO;          // en la página de prueba se muestra siempre
var p = location.pathname.replace(/\/+$/, '');
if (!DEMO && p !== '' && p !== '/index.php') return;      // solo en la página de inicio
try { if (!DEMO && sessionStorage.getItem('shineVisto')) return; } catch (e) {}

var DESTINO = '';                       // vacío: al entrar se ve el sitio actual. Con una URL, lleva a esa página
var UMBRAL = 0.96;                      // fracción de las letras que hay que descubrir (0 a 1)
var OSCURO = '#0e0c0c';
// Fuente: TeX Gyre Adventor regular y bold (clon libre de ITC Avant Garde Gothic, licencia GUST), recortadas e incluidas acá mismo
var FUENTE_DATOS = 'data:font/woff;base64,d09GRk9UVE8AACCwAAwAAAAALLwAAoBCAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAABJAAAFeMAABul4HVIREdERUYAABrYAAAAMAAAADQBwQINR1BPUwAAGwgAAATMAAAIhtDEvdRHU1VCAAAf1AAAANsAAAFuoQvCS09TLzIAABiYAAAAUQAAAGAWgbQTY21hcAAAGiAAAAChAAABBCy3LjxoZWFkAAAXCAAAADYAAAA2EEnjV2hoZWEAABh4AAAAIAAAACQF4QShaG10eAAAF0AAAAE3AAABrOjRE15tYXhwAAABHAAAAAYAAAAGAGtQAG5hbWUAABjsAAABMgAAAoY4MUzrcG9zdAAAGsQAAAATAAAAIP+CADoAAFAAAGsAAHicjVcJVBTX0u6epbunGxqYtnFNM6KigqLsEEUYFkGNSxTcUYmAoChGCWNciGZ5MV5NTIzGbC+4JnF/GoLGfU9QB0Ua3KJGjQviblI9r4bkPz2Q5b2TvPOf0+d037q36n63qr6q2zRlMlA0TbfKyB2Z9vKMXHtOSe604qIZ3YfmTnqpMHuGPtdV60BpHWmtk0ELMmqtTEe9TI173UvaMR3bmfaY4YrPF+18aauW6Ed50bSJ5X1atGzzTODxy/fyxhfkjS/MG5+XN97z6RlM6Te+f8H4yeGhUT3DkoumvzyjYFJ+sS28Z8+Y7uE9w2JteUUzbBm5I206GlvurOLcaTMLiqbNtL3wsi0p1NY/e+KUIsfMKQXdbP1DB4baBhU5sifqo9xiW3ZhqK1L0TTbC7n52YV5tqI8j53MYalDh9nShg7OHDKsa6hteEFu8bTsqbkzc20T87NnZE8szp0x0+bInZFry87Jyc3R90nPnmbLyM+1ZeRnT8sP/RvP/JeYomiKNlAsReVTlIWmvH0oG0UFtqaSWtNv0hRHUUUU9RZFTaCoORQ1maK+oah1FDWLouooaiNFbaeorylqN0UdpKjDFPUtRVVR1FmKOkdRlynqKkW/ZaamGCiaMlEs1Z6yUzXUbdpGj6Gn0HPpRfQyejN9gK6mXYZWhh6GAYZRhoWGtYbdhmpjR2OccarxVeNHxs1Gp/G6UTNxpmdM3Uy9TYNN2aY5phXmOPMA83Tza+YPzDvNx81nzT+aHzOtmLHMVOZ9ZgOzn7nOaKwP241NYAezRexb7Gr2Ltefe4F7nfuI28Vd4O5YWlu6WqIt4yzzLO9YPrNstZzkFT6Nn8Ef5R8K7YV4YbhQJCwVNghnhF+82npFemV4vey10euQ131vP++e3kO852CE6LaKboqAVXM5aDCqRjD62/hqk6pttzMiPtaWQwmt7q3ca1S15fJeKBnFgBlLmr7Ee6VOl+Ckj9R8pELuGeMRKJDR714QtFXuEefeo8BxkIDP7tuHg6E/tIMP4whSmIM2UMxgPLJpC7nINSSc7RQcn9xDISM/y/muP3KDMweRLlzNazJRv9oN9AEO+mKSORMNY7JTSBTp6yRXuBuaLB/YWX70+K7sTIWMyMkJL3j+QPEW8i9OdGc3Q/4DsIgV3583fg8FMsFBwOIY8M/kVDbkWApEEejEqSyBTtUQdfcYp7Lon4ksjiE4iBOxAnLOG7/CbrKdBf+DwMIYAoM86wchC2PQ/yBnZ+8OqcYogp04O0uwUwpGhQzhRLc1HTLpmxBtvJkut+dFvAjzKukNsMa4AebJgbzothKw0g9V40N/Gy9i0EUMljvwYmCTR7+sgUc1xi9hldyRr8HRcideDCwrcUU6adhcY4Qerkg5iBcDiVP7xUlvr4Ea1bjJv7NHHa6dArEE/J3WTTUza6BEnaFKrk0wR+7CSz935SVXsMcWtHVqmx205l9j/ADayiH8VX8o19KIO82sW9GsToh30uvOgqYa18FcuRv/m3i+g16r6uK1sFDuzqvvyKG/ozvhipR7NMFQT8MbTmu5mq/CQjVflR6XwxS5Jy81hPHSY3WxHM5LDdvhiRzRBGe+bvs3w1qpHMmrb8tRzX6CZX/4CpaZbLpY8wMrDX6q8SvdwW/CMtnGi2l6Jh920ifPgFUFTjWe1JbKZxjwrjp89/qJgVEKGT2nKO25hJTpIxfFcWeYxSfWl6unTh1b8w05wYG1201sia06xWKUAiPdS3WLl8pKYIlT6+WgV/hH8x3dveQYXowmTtjhhHec1joVvqydXCs9rfOP5SUtjlcbI2XYcZ2Vnj7LB8HPMrxzg5W0XrwIoaVV2vISeKaKrqg1VmhGuTcvXiVO7ZGTrlO1olpjnX+8R70PL6IPccI6J3yqzxnr/BN4EZPKSuCmEz5rFqlwE7524tfwGRx0ugVGhILSKihywt3mDVg5kRfXlJXAAyecd+h7SLqenRfdqWUlLoejyU4SL2LqvCqX3UGvqIHFqnEFJMvJvJj2pzUpvIijiNMV2TxO5UVY+du89qsu6utxVbPkOV2SxouQV1rlsuh4XIIOiZfT+dq35H68mF5WAvudcEw/DNzWz96fV90WeQAvQn5pFfSv0nw8eq11PbOM+ZCKfWCGcolcWPVd+b6x5XNOL+JOs28sWkAWkkJSvCJ3/cWqrxsImDkowniIxhKchYkYi0VK7Rsy9AcbBMAA/Y3tMFUhkZP7pPVHH6A6HMIuZCgZ//rQWa9tXVhG1nPl2Fne8fGXS3cRsJL6iT8HjyocNW8gQZGguWbsdU4c0ZTtdSo81aE/x4sYVVqlfVQCraqsqy5k1MLKc0NrpcerYKI8kJcaBvHS48G8iPOaOZyiGt9zRcpDePHN0ipXou4zANVYBxvk53nx6yY/Lnc5ZDjS6DhL4JjL0Yvgh41tcaWrrVmEg3+sGMqLo5pGy/yHefyqf8MK1bjE5ZAzeBHTmnLsE/9MXlxTWlVQos2vKnVYy2s1uyotLoe18nBeGjuClzaN5GuXyqN4cXXzKkhzWCtVLbFWmlvpr95hpD270s7n/Eg4iANf8IFYiEIr+GF0QA+SkDu2Lwfb7exp90R5NC++Ulql9auiy2uN5fC5PIYX1/3JaHmtlqxKe8phnTyWl+Zm8bVvy+N4ac94Xny1tAqGOyGlii6HL+QJfN0OOZsX8V5ZiVbsBD+nXgY+1orlF3jxQ5xSBW30bZqOE6NKl8phjTyRlxpy+Np35VxeHF3WvCddqcIN1Vjpn8eL7vFlJVqF4yJY6UpdNIk/7qkpYzGj2tXTIz+lGseht5zPg9FVqNcBDPPoQL6jSaegyYzubM84iRdhY1mzbytV2K0/LdpJlyr9J/PSnko724ylafqGKp2r9J/CSzur7ayeBU3O0uJ0f30pF+o0mcqLqzGhBNKaj9gUioZKzJBV2M7sTlXzbhIOYkACP4iEGPQDP4wJCCUJuVl9OenSHTt7GtfIUsO0/zJUXqsleny1TsYokNAPYpSbRN22+wyH21WXw96dlRqyziRsCyUcxqAf6iGuXSSD9fYd8AHf291QQq+QbuiNPqF3wEcR8d9lJdqcGg9I6XSlfxEvbTtvZ0Vc4zmZ9dOa4bUQUTuoVrrxKUTJ03np3Iu8dGMGL2JNU2QzHDT4q8YPtGJ5Ji+O9CRLhcdV11RpZyUslYt5adZLvLSzxNMwtAoHvUyrkGG2u+I8gdlaRSLBke4JmKFNMIuQ2LTiPa1CdugcaFbwv0KgCxRBZyy6SnAYbIRhUBZNsDNOwi4wKYbAUCwzi+iDCZ7Qvq9VyLN4EUuJUwtz0sv9X+ZFTPQgPg7WQU7rQxWSVelSU0bCNXeFPImXGjzppBfs33MW7L+lLVx1V8h60f1Wq4CMpiuCViHP4UWM0O8IMM+kLax0L2REuNM8/vfcyl/mMqKbwoQSzaW3PYNqBIOeB/o1rVrfLQ2zndphT+YCp4L1jPHUBzJa63tCS2j16DJEKakMeqcNC4kY8N0PCtnz8edVlXXV6/ct/p5LZRYNmJ5t79dvyMyxZAAHQ7Xunowv3QEHZDBj1rFN3aH3Heg1ZKP5KI6Rgf0PUXPdP//tK99aPbVfOqkXfwgGTt6YYZYulfJSwyu8dGk+L15/ZZtWuB/obXTZNog4AqOOQMw2Yxnckefy2/zn8RCBOfIRjTrMNFQ4ngsgyeNKUV7MQRSOqiHoByHmix+U7yTV3LWRe7GjghzjgdlKPjYZWMjSL2VDptzBXuYL2FuXmSELzb/JfifgdR1qEwmPeUi4vtrO3gOrB+7bpby04hVeenv+Xzd/nKatlGf/VYsG62194k/dtdxVI8/mMeKXdD3if9sN4XVtgq75F80AUm7/MXMGrHSd6lRrVOfv8+33yjYeOqNVD9n/q7zDM5pFt/mXlRZ3wDXPIZpKpF7bvnApnkM0vidP4v+2VEE7TdAV/zdzIe7xnxddBKu1Uj2s1qhHVGl/89JXXuKl/SU8+B//08mi/4JLC3ix5j+paNefFqJ0uWlaq2vi430PH2v+04RupUW7Py3UI9Ti7ylbwIvL51VN1kNrrVRV/aqkt8UkHrq4v5WlPcm8iO9jRjUE/tFbQP6jvdxqrP9TO5n9iVaxEtJWMphBWCevCs73vLxUL29XZ/kLiXpB/+NkKV+qJdWeSqDGU5Op1VQFdZ+m6Bb0eHopvY7eRTvpRwaToaWhn2GcodhQalhqWG3YathtZIydjenGLOM24xFjpfG+ydfUxpRoGm2aa/qnqdx0zATmtuZ0c5Z5inmp+RvzVbOb8Wc6Mz2YRGY0U8zsZL5jrjEPmV/YKDaFzWVXszvYU+xPLHIyF805uI+5vVwd98jCWJ6x9LWMsBRa5lhet7xv2WepszyyIG/ig/h0fjhfzL/K71fBamcElVyHTDsxC7CmEtcwwnkCn7u+iidmAUfei4IeEHLzexirQB4Lz3e8gp0wJCQCByoC9GMh7uRRMEDb7T2xlYL9WIzNeA4tttSDYFcEsDZG1rgcOIYRtAKn28zAAnCYn9zfeIhc4MC/az22xcAe3TBMqWHAu/JEw21n/3CFxA0e1iuBww/wbbOAIU9DoQ34P3oCrRVyI7sqtpwT9m9ds5N8y4Ghzzmk0ZiQgN5KDfN9+e6zp3aN6Zs6OquPspC8Tl5dzM1eTPqZ9yz6ZNFnb3KCOntfGunDdU9NDovscwB8FUHjsW0NtK1ypmmbIxl0uzebhVUYeq8ntCEcBAANDHSCjjYwoxIwnuQuGDeD2woTYD0hTvyB9HNTR14y7zy8d/1Rwj04F4cUUvExXQJCSVJN6VNOwM5AowGCoONTMEIIBHYAE7ZUCknxG5PncpAEy6MJDsC15pTA2VkkmRN+Ov/9w8dqLzSg0f5sUIc+34NJEeAxwSONkecJHHJFEqe7jx4X/0ddoR20bWiANgq5Oa4qbisnHP/8829IDQfGuItoRlN0HNIK6bcu6/gk7tmc8akknBNuO0/V33b2C+3eLy1UCUl31gcIp/ftqa7eNyq178gR6UrS8P3VAQIGPkETtFQ2kNXvbvqIwyRcfpXAAFhrPvPk0136Fp2RBgMGYcdANGKIIoBJvfjwybk4NLWPjwvqaL8IBkVPIwqWQAP5GZdcIljtcsTqOdYJbkEg3jILMICB7IunICiA/Jh7JGoLJxzZuHa3bl5KOonpCtoZAVo+eA0VW3oBhgQI0HX7pLDQMVMwIEDAQuiFsfCiAsEEmDMqPMPFMfFdU15AinCYgO0hEOzQF9pCO0gJeEKu5VZ24S4zQ0FC//PYnXA4HWMwFl8MEGAMA+XQDkKhIIBAwPNgQMPJ1PL4j7EN4TCJEbRHj1kwkTPzDhdcHbknlKCBBOdGp2UMGZswC1sSTtC6OPEyrIOzTjwLn8Jlp7sLoyNMwd5QosBUAmHQewUM4tyL0rUwZjpa0NoJgwiH/bADKJACfaE9PAP9A4Ahd0fsC+MuM6PBirYrGOVBmoi9cHKAoMIDTcIH+g0Qz7slOK+T1+WwM8K7yKspwBMOrNWXIDZAW2p3L2XRkj24l5JExuz6Ry0nqDCOuQs8LMKa2wR3aj6wE9yhBOvd8USL1/mv+TrxmCvSYzWIgS8bg04Q2OAKIo1BKiEuB7IEyxotuMplQZaYBdWlMNpzjYpn0k6I2+UO11yd9QSdAkmYCFNhMqSAHXJhEqZAIk7GfExDO2YrAsRDJ+gACZAIHbAD2jEBO2AgJmISBkIgJCuCCvshkIGss3Vggx5xp3F8AE5gBDj2lIX2d17HYNuwbOwcIKiuyCcMJNaNQx9snToJJwbAErx+i+BE+MIMgR/VXSDQkoPQqCs4V8EBjPAetr4ZCa0JtCD1t/VfyJPTj47dMnVV4YcJq9M/K35/1iecUPLpvM1kM6cePKTWHhnRSznHgFfURfRGISoGWYWM/OfoTYVfFK2e/8OLnABSzr/yybMkeuDAGBJLBh+Yf58TIL4xUnVFQrzT3ZMRMOtRGHSF4Ec/QpaiZdvd2SyGPJeMDHIDz0KILmIFmNTouEsgWnsMse7H9QTyXY4Egv0bW2Kqq2UqwdTGltjf1dIsXCOQB6chF09fI7hUE2EBNEYRHIF7cCTsiSSwABvNArzvnk+QqIQAgRXa/GcJTnGHY54Wbha0LKfbwsAv2iPidKcRkg5PCf7qfmQWMAb8UITeym1yfMPR85wQomoV9mBWyKxL39yNcBiLvuiLsQECCHfvggBed7qjiL49gpFH324N4KcI4H23HkTwuRWKPmgN7YY+6BX8ALwV3bo/+kFvBczkxp5T4MfFMEMThk/tQzj0CW4Ab/CpvwtiwCXizClP5i4z48EQeBp9PPvKaMWIAAGjQUZfiFduku82HbrACV08lNjIZp5M3KIzJg6t6IsxAQJ41esIve8Ho5cioFdIZ7SgX8hdHSNGg4QSRCvgS36+seUJ14cpTOwzKpagiXT74Q2gOO01BoajD1gwGiM8v1kRivDZ08vVT8hP5FL6WqQ54aq7WNWKoZ0T2zGLbm7d/JBwThbbk5T+S1DiohkBI8EPfSFSuUeqdnx9hctjsWPfPthK6UGGbxh2n0tmdmCLhlRQSD25uPWb77bt/fAo+ZnTMnWXZ9Smb+lBOIxEL/TFuAAB/K7/CN7A3wpFAVuEBaOAXmH1IOl0OcBAm7NH6x+cHojtFPxGhW9YGND9MgYqiWTg1LxMDj62s4IeTEZIYcF36bdOAuGc9q7d/S5LkCmaGPsPvUyYmR9+gv5YdIugA9ZCAXzek+AyvEq0Mr1KqHCWAfrQiVtXToxEUcGzKpxhwbdy/7UfDw1HHwXPqHCehYiwc+inRJMhk7OSJtRkbowjfcmEkuwMfYeDDLSpOnL/YdUw7KrgDhV2sJARfAmfUZLJ80VZwzgBe4MPitAHIoEHb4iFXugF3hiL0eiHPhipCOB78zZ4g9eN7iihX1RPFNAadgtaNCefN/jc7o5W9AnVk9MvtB6sigc6ebT/8OPlXA3b+82x06cN5oT21WlP750+80AhzsJdA9bHbn5zyZxlnFDwyZzVZCNXsWVLxe6NRSOUWuZ6v+MR4f30K0rOhwXrZ6wqWbLoXCEnXJiy/mWSwWXkTBw+KHu7UxGAb8oJHyf6QIYdM5BnBBx22w4BylVy8MttVZwQrYcBN7MCdk0d2Ln980chQIHdeg3IdVdcJMDDryDgrxcI5GsVyQT7usehrLUdRFB2t8UkbZxZgHz3unDMu0DgtMvRm+BAdzratXSzoHV1YjUD+7UoUun20qm9k+Ahd5hZ2DwMMoEpOGr23Pky9GjiCAjHcBgBIyACPG+MgAgcgSMwHCNwhCJAMujdNBmSIRADMRmTMRDbe97tob1eqVeu/mT1OrKCrJ/z6QJOWF26ZsE6soGsWfPJ59yUQ+Z5xbOLXyTzyfSPX17OCcUrZy5/kRSSmTPnFP3OHvv/JBHa/5pZ/wdDP160AAABAAAAAoBCdDsEHV8PPPUACwPoAAAAANcXD7QAAAAA1xcPufzX/gcGJAS8AAAACAACAAAAAAAAeJwtkD0vRFEURdfZtzBmFA95MiSICjejVFC4KOUmM6FU+EiECj9CItEoFApRKM3EXxCVSCQarULEhEQnaMl9o1jJLvY5Z+9jX2A52Dh7Ns2SvpnhliXbZ9n2mbScVYuMWs6WjIY8I/KcyTP2T488Q/IMyjMvj086+S1nUnUW9EpFc0Q3RU3vRFWJ1ia6HWpqEXkh2gsV1Yn2QHSnRL0S3RY1NYhum5rWiPbJgDXp0jFR15TdDWVtUFID2TO9auHVJOgQryu8jvA2S6YLvDYJ3BG4/320n452ybtJ0PH/XBNvUwQ7oM9W6NE6QZ6SC3TZMyVV6bZLyvZGZm0yW2PVvsC9F//bVZ1Fu2QiZdcHeaHT/tS/WvT0RaeUP9HqZOSO4SJDupeYI9NTB9dPpnOCnRD+AEEIS+EAeJxjYGRgYHr834GBga3kz/V/jWwqDIwMqCAbAJwQBoh4nF3IoQ2AQBAF0dl/ew3gcJtQAR1QGpogKIBOQNAJ4qpA3YXgGPOSwbXbRgYtOoD1025GE4icJMBnSPy7iOhV6gR+2gPYuzWoEARdA1uhDFQAAAB4nJWQ3UoCURSFv5NWdNMzHLoqyEGFKPCmXwojE/+K7ibnjDP4M6GW2cP1RD1EuDqGSDfdzFnsvefbay9gmydymPwOmCp4bdgzVa832DUDr3Ncmg+v8wTm0+tNTs2X11uqX5DxwpwxKT0SpljKFClyTEGqxAmWmIwxlhaORyzX+sdhcbwzxTFiQkqm1/LMHMs5AZYqIV36ZMyY0CflUNWAO/Vr6vzM/PScfIQM1N8XdcF0JKrGWDJ9l37aNLmiQVPeGtzTpk6TAxE6pGKOCBnimMh5V7SxNi8uGMv5TMppf0SEI/q954ZQTlokmmiJMCIh+COZMyLelMxU6TVw9HhloK1lAo6Ub4U2tzxQo+IpS8Y6obDG+N90x9+Y+jxXHdSV3GolJiaizxBLkYDSNymzYkAAAHicnY4xCwEBAEYfd//ADWyXQSmzlHT5GzYTJotSBgMWi1IGg8VGSpkNMhoMWNClu9GgyCb1yf0CecubXj0gDBiAhUEosMkdyGBjEiVOkiwOBRqMmTFnyYo1G7bsOHDGxefKjQdPXrxty45JgE2CFA55ij+WkW8pXxe5OumovRaaaqKRBhqqr5466qqtlpqqq6aSqqqo7OW8dPD+Fx8KqFMLAAAAeJxjYGYAg//1DFYMWAAAKJABvAB4nCXBsRGAIBQFsLxfWDmagncyAjbsPwCFieD0K4e4xK0pXRePVxmm+Cy1AUFIA894nIWVP2xbVRjFf36O7edHW1cqJHWDEhRXuLSJ0zQkThC0dZs4SVMpSxBYSpPglAnUoUJIbAg2pC5dKqGMVRaWDJTBSxcvkdBbXKEnhJc39CH0Bt7ikYPe9UtKw7/BsnWv7/3Od875ziUFOJznCtZC/fY6pz796LN7nGIAQCLeT33y8f172PEv8xnAMt82KT43/5zlOb+nrNSJ1GDqfOph6nHqh9SzVM86bQ1at61vrR+t39Kn0xfTc+lW+peB+sDuwM+ZdzP1zHrmfmY3s5fZz/yUa2V+zWazp7Mj2S+z32S/zz7PnchVcuu5r3KPc63cs9wftm2fs+fsq6SYxSaPw0nOUOQcw7zOCKOMUeI8b1LmAhe5xDgTVJjkMlNc4W2qzDHPO7zHNa5T4wY3WWCROsuscItV1nifD/iQBhvcYZNtmlic1FPWFDJAkQLj6lFRwJQ6Zm+XNbWxsPUER23S2PoCRw8Y1BOGyVPAocCwuozKoyyPt+QxLpcJ+VTUYlIdpvSEaYXMKGRWIVWFzCugppCbCqnLZ0kRy/JYUZdVdVnTHusK2ZTPXUUxwiN0AQ31zEpIWSENhWwoJEdRXcblUVGXSUVclm+6aaiLja1d8hRxtE9RB4zpgAX1WFKPHfXIUjToO1TUYVIhU3JpyCNFUQEnyct/qdtLihinxLQ6VNWhpg5L8lhVh211uCuPM+TjepQYVodRuZTlmioTCqhol0m1mdKe4WBVbdb0gAYlNuRyRwGbCthRZHg4ga2IYRxGcSjjMI1DDYclCmzgsIVDE4cdCtylYFjxEla8Y6x45LH1NY4eUVSbMbWYVkRVETVFNNRmSxFZJnCoqMdUjJFXuYPDJg7pZLVHnQJvYOspefVw1GFQBwypTVEuw/IMa2Omf48KJSYpMcUFpuUyI5eqXOblUpPLgrosGl94LMtlRS6rclmXR0MuG/LYUpdtdWmqy47xSWhU7uIooiifaxS4ToEbFFigQEM+57D1kLwCHO0xqDZDalFU65iyvUTZNlW1mVebmtosGEyxR3usG3e0Eix9xZvqsKPAaPUatlo4OmBQHkPqJExEjCqifOQdn6p85uVTk8+CIpYUGvdvKWBbAc0jB/QokI8dIJ+yfN6Sz7S6VNWlpi5L8s38bMj/B358zmLrEXl1ku5bDJlp2E/c2aGsTuLrWJkWVbWYV4uaWtyQlygSsa6nbMllWy5NuUcKWCyrZ/hJs6yAFYWsKiBHRW3qCo5WbyU7a/JjHyfJMMcIV2NPK2SRAnVKxoPbimgqwuJqoqbFqiJzOnZxSF5dKvKNx4+zui2fAeODGPuKQRiRM3NYV3gMU2hutQzaGGHaTNfhRJ01uuYVJtr2GFJgKs7IZzapHPcxr9BUvymfRRzqjLDMCCuUuMUIq4xwmyJr6rGVoGz2K+OwpgiHQUXm/ksUmFZA1SRnkJx54Y84Gb7DUYtBhQwZXwTMJCf6SIKXTsSs7Ztkf3Gin9L9hA6NBvZLq4eZvaWQbYU0Y96xtfe/lV8x+dvP3kfM6oCayV+fRQXmDVhWmLilP8f/nnOxChmT//1cc5O0bpM1K32d49uiI484Zr7Lf3mf4ndpJunp8A2KZ8c6SsyBv6VI7j/zJWUcYx266k8yA1KpeJxNjr1rAlEQxH9v310QsUghIUUIz0OCpLzqOPUg+NF4ishVdhL85CES0qTNH5V/z5D1Ba6Zmd2dHQYDNLnwgx1Py4r2+9eH59FvPs90SYEI4HrFYEmI39YTRz5aVY58UY4dr8ty5kir1cyRB+f/hwkcBRZif9xvcIo9xVQxUywAAU2wqm2YuKXpNSKmhafA8639DA0MXWVLg3se2GPJKNgiZCwQCs3Iah/PCE3a2vCIkKg6IQy0bYd+zT1Qd4ohqW1fdPuEcEeLA8KQOUJfs3ZB/XXY/gI2LSmXAA==';
var FUENTE_NEGRITA = 'data:font/woff;base64,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';
var FUENTE = '"Adventor", "ITC Avant Garde Gothic", "Avant Garde", "URW Gothic", "Century Gothic", Futura, sans-serif';
var ANCHO = 0.86, ALTO_TITULO = 0.5;    // SHINE: hasta el 86 % del ancho y el 50 % del alto de la pantalla
var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

var tapa = document.createElement('style');
tapa.textContent = 'html{background:' + OSCURO + '}body{visibility:hidden}';
document.head.appendChild(tapa);
function iniciar() {
tapa.textContent = '';


var st = document.createElement('style');
st.textContent =
  '@font-face{font-family:"Adventor";src:url(' + FUENTE_DATOS + ') format("woff");font-weight:normal;font-style:normal;font-display:block}' +
  '@font-face{font-family:"Adventor";src:url(' + FUENTE_NEGRITA + ') format("woff");font-weight:bold;font-style:normal;font-display:block}' +
  '#shine-lab{position:fixed;inset:0;z-index:2147483000;background:' + OSCURO + ';overflow:hidden;cursor:crosshair;touch-action:none;transition:opacity .8s ease}' +
  '#shine-lab.sh-saliendo{opacity:0;pointer-events:none}' +
  '#shine-lab.sh-completo{cursor:pointer}' +
  '#shine-lab .sh-texto{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
  'color:#210e0e;font-family:' + FUENTE + ';font-weight:bold;text-transform:uppercase;' +
  'line-height:1;visibility:hidden;-webkit-user-select:none;user-select:none}' +
  '#shine-lab .sh-texto > div{display:block;width:max-content;white-space:nowrap;margin-left:auto;margin-right:auto}' +
  '#shine-lab .sh-titulo{letter-spacing:-.045em;font-weight:normal}' +
  '#shine-lab .sh-fito{margin-top:.3em;letter-spacing:.01em}' +
  '#shine-lab .sh-p{letter-spacing:-.09em}' +   // menos aire entre la P y la A
  // los dos premios, lado a lado en dos columnas
  '#shine-lab .sh-texto > .sh-premios{display:flex;align-items:flex-start;justify-content:center;gap:2.6em;margin-top:1.3em}' +
  '#shine-lab .sh-col{text-align:center;letter-spacing:.02em}' +
  '#shine-lab .sh-col > div{white-space:nowrap;margin-top:.45em}' +
  '#shine-lab .sh-col > .sh-rotulo{margin-top:0;margin-bottom:.3em}' +
  '#shine-lab .sh-col > .sh-logo{display:block;margin:0 auto .55em}' +   // un gramófono arriba de cada columna
  '#shine-lab .sh-firma{margin-top:1.6em;letter-spacing:.02em}' +
  '#shine-lab canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
  // el resplandor lo desenfoca el navegador (CSS), igual en Chrome, Safari, iPhone y Android
  '#shine-lab .sh-lejos{filter:blur(16px);-webkit-filter:blur(16px);opacity:1;transform:translateZ(0)}' +
  '#shine-lab .sh-cerca{filter:blur(5px);-webkit-filter:blur(5px);opacity:1;transform:translateZ(0)}' +
  '#shine-lab .sh-pista{position:absolute;left:0;right:0;bottom:9vh;text-align:center;z-index:2;pointer-events:none;opacity:0;' +
  'font-family:' + FUENTE + ';font-size:clamp(9px,.9vw,12px);font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:rgba(200,255,180,.8);text-shadow:0 0 8px rgba(170,255,150,.5)}' +
  '#shine-lab.sh-pista-on .sh-pista{animation:sh-titila 1.6s ease-in-out infinite}' +
  '#shine-lab.sh-sinpista .sh-pista,#shine-lab.sh-completo .sh-pista{animation:none;opacity:0;transition:opacity .6s ease}' +
  '@keyframes sh-titila{0%,100%{opacity:.12}50%{opacity:.6}}' +
  '#shine-lab .sh-entrar{all:unset;box-sizing:border-box;position:absolute;left:50%;bottom:9vh;transform:translateX(-50%);z-index:2;cursor:pointer;white-space:nowrap;' +
  'font-family:' + FUENTE + ';font-size:clamp(11px,1vw,13px);letter-spacing:.06em;text-transform:uppercase;color:#e6ffd9;font-weight:bold;' +
  'text-shadow:0 0 8px rgba(170,255,150,.9),0 0 24px rgba(170,255,150,.6);padding:.8em 1.4em;' +
  'border:0;border-radius:99px;visibility:hidden;opacity:0;transition:opacity .6s ease .9s,visibility 0s linear .9s}' +
  '#shine-lab .sh-entrar:focus-visible{outline:2px solid #e6ffd9;outline-offset:4px}' +
  // con mouse, el botón se rellena al pasar por encima
  '@media (hover:hover){#shine-lab .sh-entrar{transition:opacity .6s ease .9s,visibility 0s linear .9s,background-color .25s ease,color .25s ease,box-shadow .25s ease}' +
  '#shine-lab.sh-completo .sh-entrar:hover{background:#e6ffd9;color:' + OSCURO + ';text-shadow:none;box-shadow:0 0 22px rgba(190,255,170,.55);animation:none;opacity:1}}' +
  '#shine-lab.sh-completo .sh-entrar{visibility:visible;opacity:1;animation:sh-late 2.4s ease-in-out 1.6s infinite}' +
  '@keyframes sh-late{0%,100%{opacity:.7}50%{opacity:1}}' +
  '@media (prefers-reduced-motion:reduce){#shine-lab{transition:none}#shine-lab.sh-completo .sh-entrar{animation:none}#shine-lab.sh-pista-on .sh-pista{animation:none;opacity:.5}}';
document.head.appendChild(st);

var raiz = document.createElement('div');
raiz.id = 'shine-lab';
raiz.setAttribute('role', 'group');
raiz.setAttribute('aria-label', 'SHINE. Fito Páez. Ganador: Mejor disco de rock, Latin Grammy 2026. Nominado: Best Latin Rock, Grammys 2027.');
raiz.innerHTML = '<div class="sh-texto"><div class="sh-titulo">SHINE</div><div class="sh-fito">FITO<span class="sh-p">P</span>AEZ</div><div class="sh-premios"><div class="sh-col"><div class="sh-logo"></div><div class="sh-rotulo">Ganador</div><div>Mejor disco de rock</div><div>Latin Grammy 2026</div></div><div class="sh-col"><div class="sh-logo"></div><div class="sh-rotulo">Nominee</div><div>Best Latin Rock</div><div>Grammys 2027</div></div></div></div><div class="sh-pista">Mové la luz</div><button class="sh-entrar" type="button">Entrar</button>';
document.body.appendChild(raiz);        // encima de todo el sitio
document.documentElement.style.overflow = 'hidden';
var texto = raiz.querySelector('.sh-texto'), logos = [].slice.call(raiz.querySelectorAll('.sh-logo'));
// logo de los Grammy (gramófono), dibujado en el lienzo como una letra más
var LOGO = new Path2D('M66.9,60.63c0-1.13-7.23-2.05-16.15-2.05s-16.15.92-16.15,2.05v3.42c0,1.13,7.24,2.04,16.15,2.04s16.14-.91,16.15-2.04C66.9,64.05,66.9,60.63,66.9,60.63ZM46.1,3.27H46.1c-1.1-.6-2.49-.66-4.12-.18-5.4,1.6-12.08,8.5-17.03,17.6-4.94,9.1-7.11,18.46-5.52,23.86.48,1.63,1.28,2.76,2.39,3.36,1.1.6,2.49.66,4.12.18,5.4-1.6,12.08-8.5,17.03-17.59,6.58-12.1,8.01-24.57,3.13-27.22M69.81,40.57c-8.32-6.32-14.26-12.41-19.39-20.15-1.05,3.7-2.67,7.68-4.85,11.7-2.12,3.9-4.58,7.43-7.14,10.35,4.66.02,9.07.33,13.58,1.01,5.52.82,10.71,1.73,14.46,3.67,1.24.64,2.31,1.56,3.16,2.65l-16.49,2.34c-.53-.91-1.39-1.51-2.37-1.51-1.6,0-2.91,1.6-2.91,3.57s1.3,3.57,2.91,3.57c1.15,0,2.14-.83,2.61-2.02l17.91-2.54c.17.68.28,1.39.28,2.13,0,2.4-.9,4.59-2.37,6.26l6.87.97c1.15-2.16,1.8-4.62,1.8-7.23,0-6.96-2.72-10.71-8.05-14.77M75.62,66.13l-24.88,3.52-24.88-3.52v19.33l24.9,4.99,24.86-4.99S75.62,66.13,75.62,66.13ZM50.76,123.36L3.77,113.11l13.88-25.65,33.09,6.08,33.1-6.08,13.88,25.65-46.95,10.25H50.76Z'), LOGO_W = 101.49, LOGO_H = 126.13;
var titulo = raiz.querySelector('.sh-titulo'), fito = raiz.querySelector('.sh-fito'), premios = raiz.querySelector('.sh-premios'), firma = raiz.querySelector('.sh-firma');
var lienzo = document.createElement('canvas');                 // fondo y luz del cursor
var haloLejos = document.createElement('canvas'), haloCerca = document.createElement('canvas'), nitido = document.createElement('canvas');
haloLejos.className = 'sh-lejos'; haloCerca.className = 'sh-cerca';
[nitido, haloCerca, haloLejos, lienzo].forEach(function(k) { raiz.insertBefore(k, raiz.firstChild); });
var c = lienzo.getContext('2d');

var m = { x: -9999, y: -9999, adentro: false };
raiz.addEventListener('pointermove', function(e) { m.x = e.clientX; m.y = e.clientY; m.adentro = true; });
raiz.addEventListener('pointerdown', function(e) { m.x = e.clientX; m.y = e.clientY; m.adentro = true; });
raiz.addEventListener('pointerleave', function() { m.adentro = false; m.x = m.y = -9999; });
raiz.addEventListener('pointerup', function(e) { if (e.pointerType === 'touch') { m.adentro = false; m.x = m.y = -9999; } });

var W, H, dpr, glifos, carga = null, visto = null, nVistos = 0;
var completo = false, entrando = false, cuadro = null;

function completar() {
  if (completo) return;
  completo = true;
  raiz.classList.add('sh-completo');
}
function entrar() {
  if (!completo || entrando) return;
  entrando = true;
  window.removeEventListener('keydown', teclas);   // el sitio vuelve a usar Enter y espacio normalmente
  raiz.classList.add('sh-saliendo');
  try { sessionStorage.setItem('shineVisto', '1'); } catch (e) {}
  setTimeout(function() {
    if (DESTINO) { window.location.href = DESTINO; return; }
    document.documentElement.style.overflow = '';
    if (raiz.parentNode) raiz.parentNode.removeChild(raiz);
    cuadro = null;
  }, quieto ? 50 : 800);
}
raiz.addEventListener('click', entrar);
function teclas(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  if (completo) entrar(); else completar();
}
window.addEventListener('keydown', teclas);
setTimeout(function() { raiz.classList.add('sh-pista-on'); }, 700);
// la instrucción titila hasta que la persona mueve el mouse o toca la pantalla
function sinPista() { raiz.classList.add('sh-sinpista'); raiz.removeEventListener('pointermove', sinPista); raiz.removeEventListener('pointerdown', sinPista); }
raiz.addEventListener('pointermove', sinPista); raiz.addEventListener('pointerdown', sinPista);

function ajustar(escala) {
  var w = raiz.clientWidth, h = raiz.clientHeight;
  escala = escala || 1;
  titulo.style.fontSize = '100px';
  var fs = 100 * (w * ANCHO) / titulo.getBoundingClientRect().width;
  fs = Math.min(fs, h * ALTO_TITULO) * escala;
  titulo.style.fontSize = fs + 'px';
  var anchoTitulo = titulo.getBoundingClientRect().width;
  // FITOPAEZ: grande, al 18 % del cuerpo de SHINE
  fito.style.fontSize = Math.max(16, fs * 0.18) + 'px';
  // la línea del premio y «Gracias»: más chicas, sin pasar el ancho de SHINE
  var fl = Math.max(11, fs * 0.07);
  premios.style.fontSize = fl + 'px';
  var al = premios.getBoundingClientRect().width;
  if (al > anchoTitulo) { fl = Math.max(9, fl * anchoTitulo / al); premios.style.fontSize = fl + 'px'; }
  // el gramófono, antes de las líneas de los premios
  var lh = fl * 2.6;
  logos.forEach(function(lg) { lg.style.height = lh + 'px'; lg.style.width = (lh * LOGO_W / LOGO_H) + 'px'; });
  // el texto va centrado y deja libre abajo la franja del botón: si no entra, se achica todo
  if (escala === 1) {
    var libre = h - 2 * (h * 0.09 + 64), alto = texto.getBoundingClientRect().height;
    if (alto > libre && libre > 0) ajustar(Math.max(0.3, libre / alto));
  }
}

function medir() {
  ajustar();
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  W = raiz.clientWidth; H = raiz.clientHeight;
  lienzo.width = W * dpr; lienzo.height = H * dpr;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  glifos = [];
  var rango = document.createRange(), recorrido = document.createTreeWalker(texto, NodeFilter.SHOW_TEXT), nodo;
  while ((nodo = recorrido.nextNode())) {
    var el = nodo.parentElement, cs = getComputedStyle(el), tam = parseFloat(cs.fontSize);
    var estilo = (cs.fontStyle === 'italic' ? 'italic ' : '') + (parseInt(cs.fontWeight, 10) >= 600 ? 'bold ' : '');
    var alfa = el.closest('.sh-firma') ? 0.85 : 1;
    var enTitulo = !!el.closest('.sh-titulo'), enFito = !!el.closest('.sh-fito');
    var ls = parseFloat(cs.letterSpacing) || 0, mayus = cs.textTransform === 'uppercase';
    c.font = estilo + tam + 'px ' + FUENTE;
    for (var i = 0; i < nodo.data.length; i++) {
      var ch = nodo.data[i];
      if (/\s/.test(ch)) continue;
      if (mayus) ch = ch.toUpperCase();
      rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);
      var rs = rango.getClientRects(); if (!rs.length) continue;
      var b = rs[0], asc = c.measureText(ch).fontBoundingBoxAscent || tam * 0.8;
      glifos.push({ ch: ch, x: b.left + (b.width - ls) / 2, y: b.top + asc, tam: tam, estilo: estilo, alfa: alfa, espejo: enTitulo && ch === 'N', respira: enFito, titulo: enTitulo });   // la N de SHINE, espejada
    }
  }
  logos.forEach(function(lg) {
    var lr = lg.getBoundingClientRect();
    if (lr.height) glifos.push({ logo: true, x: lr.left + lr.width / 2, y: lr.top + lr.height * 0.85, tam: lr.height, alfa: 1 });
  });
  if (!carga || carga.length !== glifos.length) {
    carga = new Float32Array(glifos.length); visto = new Uint8Array(glifos.length); nVistos = 0;
  }
}

function armar() {
  var n = glifos.length;
  var capa = nitido; capa.width = W * dpr; capa.height = H * dpr;
  var cx = capa.getContext('2d'); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // copias reducidas de las letras para el resplandor; el desenfoque lo pone el CSS de cada lienzo
  var lejos = haloLejos, cerca = haloCerca;
  lejos.width = Math.max(1, Math.round(W / 4)); lejos.height = Math.max(1, Math.round(H / 4));
  cerca.width = Math.max(1, Math.round(W / 2)); cerca.height = Math.max(1, Math.round(H / 2));
  var lx = lejos.getContext('2d'), nx = cerca.getContext('2d');
  lx.imageSmoothingQuality = nx.imageSmoothingQuality = 'high';
  // SHINE en peso «medium»: cada letra regular con un contorno fino, dibujada opaca en su propia imagen
  // y después aplicada con transparencia, así el contorno no se nota como una capa aparte
  var COLOR_SHINE = 'rgb(220,255,190)';
  glifos.forEach(function(g) {
    if (!g.titulo) return;
    var sw = Math.ceil(g.tam * 1.2), sh = Math.ceil(g.tam * 1.15), base = g.tam * 0.92;
    var k = document.createElement('canvas'); k.width = Math.ceil(sw * dpr); k.height = Math.ceil(sh * dpr);
    var kx = k.getContext('2d'); kx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kx.font = g.estilo + g.tam + 'px ' + FUENTE; kx.textAlign = 'center'; kx.textBaseline = 'alphabetic';
    kx.fillStyle = kx.strokeStyle = COLOR_SHINE; kx.lineWidth = g.tam * 0.032; kx.lineJoin = 'round';
    kx.translate(sw / 2, base); if (g.espejo) kx.scale(-1, 1);
    kx.fillText(g.ch, 0, 0); kx.strokeText(g.ch, 0, 0);
    g.img = k; g.iw = sw; g.ih = sh; g.base = base;
  });
  var reloj = 0;
  return function() {
    reloj += 1 / 60;
    for (var i = 0; i < n; i++) {
      var g = glifos[i];
      if (completo) {
        // todo el mensaje queda encendido; FITOPAEZ respira despacio, sin llegar al brillo pleno
        var meta = g.respira ? 0.62 + Math.sin(reloj * 1.4) * 0.16 : 1;
        carga[i] += (meta - carga[i]) * 0.04;
      } else {
        var R = Math.max(120, g.tam * 0.9);              // las letras grandes se cargan desde más lejos
        if (m.adentro) { var d = Math.hypot(g.x - m.x, g.y - g.tam * 0.35 - m.y); if (d < R) carga[i] = Math.min(1, carga[i] + (1 - d / R) * 0.12); }
        carga[i] *= 0.9975;
        if (!visto[i] && carga[i] > 0.55) { visto[i] = 1; nVistos++; }
      }
    }
    if (!completo) {
      if (nVistos >= n * UMBRAL) completar();
    }
    cx.clearRect(0, 0, W, H); cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
    // antes de descubrir el mensaje, FITOPAEZ respira apenas en la oscuridad, como invitando a pasar la luz
    var respiro = completo ? 0 : 0.07 + Math.sin(reloj * 1.3) * 0.05;
    for (var k = 0; k < n; k++) {
      var gg = glifos[k], cg = gg.respira ? Math.max(carga[k], respiro) : carga[k];
      if (cg < 0.01) continue;
      var a = cg * gg.alfa;
      cx.font = gg.estilo + gg.tam + 'px ' + FUENTE;
      cx.fillStyle = 'rgba(' + Math.round(170 + a * 50) + ',255,' + Math.round(150 + a * 40) + ',' + Math.min(1, a * 1.2) + ')';
      if (gg.img) { cx.globalAlpha = Math.min(1, a * 1.2); cx.drawImage(gg.img, gg.x - gg.iw / 2, gg.y - gg.base, gg.iw, gg.ih); cx.globalAlpha = 1; continue; }
      if (gg.logo) { var esc = gg.tam / LOGO_H; cx.save(); cx.translate(gg.x - LOGO_W * esc / 2, gg.y - gg.tam * 0.85); cx.scale(esc, esc); cx.fill(LOGO); cx.restore(); continue; }
      if (gg.espejo) { cx.save(); cx.translate(gg.x, gg.y); cx.scale(-1, 1); cx.fillText(gg.ch, 0, 0); cx.restore(); }
      else cx.fillText(gg.ch, gg.x, gg.y);
    }
    c.fillStyle = OSCURO; c.fillRect(0, 0, W, H);
    if (m.adentro && !completo) {
      var l = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, 160);
      l.addColorStop(0, 'rgba(150,120,255,.18)'); l.addColorStop(1, 'rgba(150,120,255,0)');
      c.fillStyle = l; c.fillRect(m.x - 160, m.y - 160, 320, 320);
    }
    lx.clearRect(0, 0, lejos.width, lejos.height); lx.drawImage(capa, 0, 0, lejos.width, lejos.height);
    nx.clearRect(0, 0, cerca.width, cerca.height); nx.drawImage(capa, 0, 0, cerca.width, cerca.height);
  };
}

function bucle() { if (entrando && !cuadro) return; if (cuadro) cuadro(); requestAnimationFrame(bucle); }

var fuente = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('40px "Adventor"', 'SHINE'), document.fonts.load('bold 40px "Adventor"', 'SHINE')]) : Promise.resolve();
var espera = new Promise(function(r) { setTimeout(r, 3000); });
Promise.race([fuente, espera]).catch(function() {}).then(function() {
  medir(); cuadro = armar();
  var t = null;
  window.addEventListener('resize', function() { clearTimeout(t); t = setTimeout(function() { medir(); cuadro = armar(); }, 150); });
  requestAnimationFrame(bucle);
});
}
if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();
