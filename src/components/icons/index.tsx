/**
 * Pure React Native Vector Icons
 * Crisp anti-aliased icon components using pure React Native Image + tintColor
 * to eliminate native binary linking requirements and New Architecture (Fabric) view config errors.
 */

import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ImageStyle>;
}

const ICON_DATA = {
  bell: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALmSURBVHhe7ZotUBxBEIWRkZFIJDIyMjIyEomMRCLjIiORSGRkJDIyEomMROJep15Vz9XuYza7cLO9fVfzVV1RXPXeTO9Md7/5OTnpdDqdTqfT6XRCMLN3ZvYJwIWZfRt8Lvm9mb3XZ44COgjgJ4BnmwHAPYCvfFn6OweHmX0B8KhOLgHAXwBXB/kizOwUwG916i0AeDCzD9pGWthZjp46sg8AnjibtK10uPOTcQ7gl8f3mTx35nnibub5i+FzqaATUyNPx9TpKVgJAPyovQh+B+CjPpOCWsy7E5dqu4SpUPKkmqtcMj4rHeVofVbb1+DJ9EUV4QxR281gmaqN1FtHXjGzc0+CO3xmnartJnhSGwHgRu32wfWAtpFjFlC5Sceaj05tlvF/tQvHM/YoW1Pyql0LfM0wYvOKUEt+rWJfYVXQhszsWu1CqcX/miWqEgZNc82rAfBdOvSsNi1RrUFlqTahALiVDj2oTUtcUQ7b+6M2oVQqwL3atISlT9p7UptQVKVxRqhNS2p6YNP9Ai2BLFVq0xLfSlPO1S4Eih3tCauC2rWEdV/b5F6i2oVQq8v7Ln7m8H0DZRXdMcuECFp960obXDvsJokWQYVK4t1GDEWLoEIaMRQtggppxFC0CCqkEUOVWFxVBBXSiKFoEVRIIYa2EEGFFGJoCxFUSCGGthJBBW04Kvx2bCWCCpUEHCeG/AxPOxAiggoVMbT+UTpjXB0v+CkQLzZEfUYHJQV/Ee2TsV9r0bKXFs4G9WEvVPdnp/n6YCLppWWVpMhZUInFjJ+byIo0C2UqT3CWHmP5afDVUvvU0AlJnv+95+PO7+xTX4lZAkd+4DwdelSbITxYFfs7tTko9AU41ZWbH4HrRYhVTprD8OuvI7iDo+sGvwozGn23bVvPo6ldbCh4xua1Of59IbLWuGixCbVZsISDH/0hE7lgkqjttVCWXJwuqzp99qjw5TRvgg7V263L7TwKrtPpdI6df+kphymoHfsDAAAAAElFTkSuQmCC',
  shield: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALTSURBVHhe7ZkhdBsxDIYLBwsLCwsHCwsHBwsHCwcLywYHAwsLCwcHBwcHBwcHx37tKU/X5+gk++5iq26eP5jI1u//bJ3inJ0NBoPBYDAYBENE50T0iYgeANwR0YWOOTmmRQN4JgMA30/OjNKiPd60GVsX7fEmzKi9aI+uzDhm0clCrirMEWsGgOsWgisYeqvnrA6ADzp5jtKiPbaaAeCznqsqAJ50Us3WRXusMQPANz2+Krw4nZSpvWiPkhmsQ4+pijYAwM/Wi/ZgMyR/qifcgLYJC4TrCU9YIFxPeMIC4XrCExYI1xOesEC4nsiERHQp9wXX+ruJSD17ohLKZUmax2xzo/S8EJGQiG4A/FN5fug4JkLPAa0T8rYH8DfNITzoWKa1nhktE0pn9yudX3L89rrNlnpMWibkHzLp3DI/H4X3OnaipR6TNQmlit/nqvgEgK/pvAkfdWzKGj1VMBKaxYmfmop71DET8ivS4l7Hagw9zQ2YbVPrKXHR0kGWCVbFl9gnHathk/XYCANu04SSdHZO2RQdx6QmeBWfdxURvUvn03BRlOKoMd8W1WBhetsxVqV2dsvehC0Vf6Kg4VzHV0fEz9wXUS9PToR6JvwxPpvtJAsAu61jq2GdPxGyU3GuCQazWqLhS089SCiOrU7mnB/czC40oVjxvYLZ/NzncKo9i7xRca4JCyu+VzCfdWw41g2tiL1M4ywTFlZ8HmcVTL4QzY4NQQQe3M6KQBZ9IFBid1wwxbhi1V5q8KvSaosC+GLMOTtiXeAVKV6Ejl1Cpsje6dhuyPT1q15TS1+zXXJso+K1ubrR6pZCq9p3m1uLpe2y5tjd0xVrz3FXbW4tMpVct8vmG+RV29xalNrlVj1EV2S6uauu29xaeO2yRXdtbi28rZ7SbZtbi0yx29N1m1sLr132Xo8niW54Sg3SScL/Bsm9wP6WWH8/GAwGg8GgKf8BFWiQXL1LjagAAAAASUVORK5CYII=',
  warning: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKySURBVHhe7ZkhcBwxDEUDAwsLAwsLAwMDCwsLCwsLwwIDAwsDCwMLAwMLCwsDy74yP6NkfFrZa2/3dtc7ejMH7ix7T/LJ+tadnARBEARBEATB4ojIhYhcAfhsx3YPnZZDvlub3SIipwD+pt4D+CciH63tLgFwkzr/CoCf1nZ3iMiZ7naOT3bOruAuW49TAPxmith5uwDApXXYA8A3O7d79OB7dJy9cz5jiry3a3QNd9VxlAFhYAZpAeDWrtEt3E1b9tTJy2TcOxj3URa9smdLHhWhY/OQ2nQJd9FxjLt9ZuwG4kht+5bJAH45Tt3oGKvC213Akce0ZVD6LIsUNTmHbElMgvCQfq5c2bU3jzr5x3oiIl84bk9+APc6L5cyfZVF3u4cRx5fx21q8H0ydpuO6Xg/94SaslYKQGH+xdtDtkxG3d0Zm2wAdNwVTqnNJqnN4bEA6BnCi9EBAL6mdpvD0/tet2csAKRQRd5Z203AE975wqwEgzpeEwBiq4XavuiITZFTcrkGR20AmFL2QNxk+yyj912nSG0ASGbt7ZTFQpsru0stAWDOt/y6FmdKnrYEgPD0T+11zvrtM6vp9Ytxt4rStTUAxKswq7bPCm2u0S9F7W/mjAZA/0k6wNMYi5FTazU/S2fuQCt4ZNJt+fbZWJtrDAaJTnPnAVzXipvCPSF74B6FNUvT6u2zgt4/aHMdi5zoWqx9Zk9wfXix7M3Nau2zwgVl0oP1ZJ80d/H22Vibq4X0ugvgaUopK6Ri81pVjLW5WnBujlVl0LJY+2zu8mPXA3BubWqw6yTM2z6raXO1IiIf9H+BKu2QwxFVk3+ZLovnWiNHb59l9P6TqritvAaH8yztM6/s9QRltvWpCe+U7Yn/lsheI6InZrkpUuY6OdfD68dUlRkEQRAEQRAEO+cZzYcBDAVlv9cAAAAASUVORK5CYII=',
  chevronDown: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEUSURBVHhe7dghTsRQFIXhkSwBiUSOZAlIJJIlIJHsAIlkWUiWgMSdQ0h6k+aGzutAb6Fv/s81uS+356Smb7cDAAAAAAAAAKDJ9l7Sq21Lepd0m2cqSboa77d9k2dKSXr7Wp7c5bkKkq4lfYwXD8/nebaE7Yvx8qS0hO/Ch9W+QttnUy8xKCnhUPjBPp8pI+k+b08WLaEVXtJzPlPO9mN+kWSREmaEf8lnVlNdwr8OH6pK2ET4sHQJmwofliphk+HDb0vYdPjw0xK6CB+OLaGr8GFuCV2GD60SJD11Gz60SpjSRfhwbAldhQ9zS+gyfGiV0HX4MFXCSYQPth9S+PX/5/+a7cvhYmW9mxwAAAAAAAAAJ+0TF3PDdZoJd0cAAAAASUVORK5CYII=',
  chevronRight: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADtSURBVHhe7dotDsJQFEThSpaARCK7BCRLQCKRLIFdIFkWkiUgcTOkvDZpbvqDwHB7Pt0nzqSmzasqAAAAAAB+xnYt6W7bkp6SDvGZ1CQ9mvjgGJ9LyfYmlvfkH8H2StIrlvfkH0HSOVYH+UewfYnVASMwQsEIjFAwAiMUjMAIBSMwQsEIi/ifMDVC+3W5jmfSkXSL8Z30b4Gk/cx/hDqeSWMuXtI1nknji/hbPJMG8cQPIz4r4okfRnxWxC813vZusfGNkfsBH+njp+4HpI9vjN0PWER8R9IpxOf9nh9je9telMj7JwcAAADAX3oDB8rJdOuMOTYAAAAASUVORK5CYII=',
  plus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEVSURBVHhe7dixSgRBEIThCw19hAsNLzT0MXwM39bQ0NDQrEoGWlhKkROcpZ39P5jkaJjp2t056NMJAAAAAHZk+yLp2bYlvdp+yJqlSXoZzX+S9Gb7NuuWNJ7+tvmNY7wFo9HsvBBA1i6JAAiAAAggOy8EkLVLIgACIAACyM4LAWRtW7bP1civl6Sn7Hyo37/UX7nOecYptpOcbnaZLOUkp5upkyXbd7lhU3PeAts3kt5zt4bm3QeSHnO3TsZFmmf+c/Up5C189Zr0LzDWJc/aUh32O3O+3W4IgAAIgACy80IAWbskAiAAAiCA7LwQQNYu6fABSLrPzssxAvhhsjRvktNNTpZ2meR0s5ks/Y9JDgAAABbyAcj0skqcVoBvAAAAAElFTkSuQmCC',
  users: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPUSURBVHhe7ZktcBRBEIUjkUhkZCQSiURGoihkJDIyLjIyMjISiYxAIJFIJBJ57g31qHdXu2+7d+f2du8CNV/VFVWke3d+el739J6dNRqNRqPRaDQai1JKOS+lfCyl3Gx/AK5KKa/dNgPAu47/21LKS7d5dnDQAH6UEQD85OK4b5dSygWATeD7HcAbtz853B0ADz7gMQB8KaW88meRqWcBuC2lvHC/k8CwBvDLB1kDgN+MmuCZ127rMBpOfiy087Mmv0WhPtAGLkJ0DLowUtzvqGShCuCb7yzPLoBHtyXazTCkpQfvM23x9xyNUsplMBju2LXbdpFQRlFz47ZduEAA7txJzwoXb1Wk5j6YK7eLUFpzXy7e5JkG8BT4HjcKGJbBIJ7cbgwA98EzJidCvXC/qahbHACffATcVbcbQ8WSUzURZo+uE4DPbrMqysPdAWzcpoa5E6HImt9e0Xcwrv7UA7epwc9z7URcRFlUuc2quBpzQG5TgwtpzURYPXZ95HfrdquSVGrnbjcGFd8fUDMRP37i0u1WJUljd243hm6HzuhEkvcyfYZ3itVQUdITMA2m6qbGAUf+WRTpfdHOV0XNKuie7oNhuXrhtl00+Z6Ky7eXAVQCP2YlMNHfjl8FEu0Ka3gf1N9yOBoYwz7aef3fLoxVLk9dhDa1EbcaugqnA+UOMbVFC2X0GiSeZh0997ST35JkhGqiK63aaSHPqhmyZeSGl6KwT1tjnKiihz/WHVyUUCSfBWqODC44EWPtsH8aCSObF9y9r6z0Oj82Se4BfNhn8rp58pgx6/Bf1gLV/qsjIbyrELoeErKHsSuwWuMheh8X5TSLwarNLzNz0WKwMuyJm985IpQOaXechVCBMihklkCFza6vELXdMpSOU1FdBJ3tNO8vheoAXpaoKdSN6gyjxuuyaVIDmSpOKHQ80wzlsBzefjLTpEY1Q38fhLVSLjVn0JPc4mX1QWjyTFshytOpkI0hAU0XVpNMcz9bc1l07Hs7TcmEiC+eO3FHuhIKqvQmDWldrjLfw8aXiZAiYrKFvS/RDZPUXHkZ9oFf+sFlkuzOHtXuSzJyDxh8PuuiozrITjwmbltF1PqubVoeSnTsaoQt+mbA1Op2VXgjQmIzUOU1yHoNNe9Pvj+GWSklWcllVLWS6CjUhHNSPld9cNmRvPyoDYio78j6we2cuX49kgbkPDU9ABe1mu8GZK7fDi9O5n75ORRPbbUiPNdvR5ABRr/dr4XXIRQ4t4mY69dDZSbLXEbD0cN/i+p+joPHsrr4muvXaDQajUaj0Wg0Go3/nT+HSBh157Y3kgAAAABJRU5ErkJggg==',
  key: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL2SURBVHhe7ZohbBwxEEUDAwsDDwYGFgYWFhYGVkWBhWWBgYWBrVRQeAoKDGtQVdhKVRVYGKmS/1RT/T1t/o339u6qrNfyk06R9sa+GXvG/vbm4KDRaDQajUaj0Zg9ZnZsZu/M7FS/qx4G3udMbaoFwHsJ3gB8VrvqMLNDAFcaPHmr9lXB4JcatQPgzsyeaZtq8OAY5BoAbmsPfpFS+qqBO8yIQ21TDb7NpZR+aeCOrwVqXxVmdgLgtwbueEaofVUAeJELvqPaDADwCsCDBhxR3SC4mtMgnZTSA4Av+typZhACafsPlsLpBh0w70GIpK3D4E86u6FBmOVZYIO09QH4lGmzNggAbtS2aHKBKFF6R20BXKjdk+BixVdu1nD3OQPwXG07hqRtRG4Q/ADk/QC4fFI5zAAuAXxXZ/t4DTPFF722i1zwKaVrANf6nJRR4xQp9+rdEL6vAzhntoSD1s1ylN78ftoap2MX6tg2APijzxzPpuC3yqhxhw6FafsfCC8yJq1xZWCf9tT2teDRgsdUPx9RKmXU9RBe8+q1w4uIY7XvA+CNtusA8FHti4Or/dosas1GuILTdn144FmpvCJh7anjt2oXkSubPmP7mgydfc7aYNp3mNlLafsjpfSz/4ysNEJR+MKmnm6zFXHn8IXwhpl0RMWofb7WtkXgjqmz+9YsB+XRZYeXitoVgYoed1xtdoG7R7/fpdoUgR5TXcKqzS74Kyzpd1qJm0N3AD/YqM0ueMDSb7ED4IcX5UjttiXYWdaOukWg2xjZS7pmxFF4FpgcqkBdsb/t8yoKwId+f+wze3EyOVqvdHi0FuiT0QD3alcUkRhytp01iqDoTFGmCOqjeoCOe2mMqt3cDVKxq78ydBlCURP+gxLvBMIrbw5gmWeACL6pzb6v8xmm5r/iX18ss8wi9RWf6SiVt6G7HNW+ZwO3xjCtNzHmBmk2cGELr7cVvt8btWDODio7v7ldsvZXH39D5AOlbRqNRqPRaDQajcYk/AWxQ0vrONvxCgAAAABJRU5ErkJggg==',
  share: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALoSURBVHhe7ZmvbxRBFMcrK3EgkZVI5EkkhoA8SYJBIJAYUomsg4R/oEFVIgkKiQQSEnAEQQgk+3nkkVkyfDO7Nzt32+5c55NU9Pqd3b43P9773hwcNBqNRqPRaFSEma2Ah2b2JPyszOyK6vYKMzsEjoGfNgBwambXdGz1ADeB9xpwCuAbcE+fUS1huQ/O+hB7kYSw7D9ocDmEpF3XZ1YF8GwgsMe+LVxjZkfAfV/6Ce1rfWY1+KmuSz/8fkO1jh9+wJdYH1iptgqAWxqJz7zqYszstg7wcqm6KvBgE8E8UJ2SWDWnqqkC4EUcSM+mGQXeiL6+c8DM1sD3OJAe7wdUH6PnAHCmmsUSAh8te8CJjuvxipDQH6tuceQE7gA/gKs6vseXu47xg1F1iyE38Jiwx4/kOV4CzxJa3w6HsXYR5AYOvO267pd+7nhwPuMbPMK8sz/Vlk4I3Jfy3wYmVQ5z8Cqi798JJba0JPAYf59qxwgldPdLv8CWnmwTeEzOu2e1wqW2dIycwBXf12EF+v7vf9w0rce231ZsY0tTlAR+oUy0pclT26kucGeqLQWextqeTT38YimxpcBLHVBtAgbq8H+dWIrEqtkPW+qBqSbFXthSJ3UA5pSbqm1pjDcWcSAhmNFmA7ibGLN8W5piwGN7T5BcBX5oAp2OMbM7qq0G3c/OiC39rFoH+BqM0+579LkJTU6yDc60pf8I+voSMVAOi9kmEVNt+M4osKWf9DMlNxElNnwWptpSb5nDPzbKWCJy3tkzqyWOmWpLSxNRasPPJQklTEzEo67rPurfclj87XBuIpQRG17n7fCURAC/h2x49bfDExKx1rE9e3E7vCkRwDsdE6MHZrU2vOu6V3EgPZu+79e2vYpzIEXKhgPPU31CjJ4Dl8qGDzjXy2HDnfCtszLv/eCc6H52Rmx4PbfDuezAhtc7+z2lNnxTtaiKAhs+z+3wRZJjic/NCl8kU214o9FoNBqNQf4AApJRzmey11YAAAAASUVORK5CYII=',
  clock: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPZSURBVHhe7ZsvcBQxFMYrK5GVlUhkZWUlshJZiaysQ1YikZWV4BAIJIOq7GBAVqL6hfmY725y3yW72U1yvZvZ38zO0PbtS+7l/UsuHB0tLCwsLCwsLOyAEMJxCOFcz7sQws3qAfA++tsrf/dgCSGcArgC8DVMAMCPEMJ1COG16zwIQghvAXz3DzYHAA/0GB9jL6ELT13tUgA80rA+5l4QQjgBcO+T7oHC443P4cXgZAD88YnGAPgL4A7AZSrRRQmSofOpUN9lrONF4CQ4GZ/gCnnFLLdVOH10ncaNv7czVMKSKA80cVNVkjsfYwU9xt/pjlx5CwBPpSsO4EI9QJErAzhTItwCwK3Ld0MT2XJ7Ta6obuvDx+8WGYG5Y6DK9C+VcsetBKWaX9zBecUA8NllcjBh0u3j96WDifHM5ZviE9fAXPniD098Ffmzy4xBo8U6pIdzOXbZJrjbakDGfJHbx7QwgMKBXeIG3Fe4bBPUgPhgFy5XQgsDEIXkRj5SiLb1Amb2eBANdO9ypbQyAGEFiHVJ3weXqyK1+jV1vqUBFAobiVle0cYLGOOxcg0we/VJSwMQnSdsUFpaR9G+3Dl3uSm0NgA3Y7E+6bxzuVn4vp6Z32Wm0toAJKGTFaouDDKWre69E5NtYYBUGMyqUmu0RXWKev0hehiAJTHWKb1XLjeJzKbn1OWm0sMAxHuC6u1yyq2q4yptgCf+buDhIcloVvfdYnW4sqEwhdUJkDw/P/+M9ZYyZoSEYYs3WUl810ULu8wcAPyO9ZYy9oH84KQ6tLzNZMflMnNI7SoLuXZdMQkPqDNAqglymTmoff2i2P8F4Fsi7v1hOA5uu313WN0M6Sssp7oK9ELNz5rqo7JMH1DVBvdCR+vOYMiMktkItd1qNiLVs4xVjSIStfXBZfYBrwDixOUmk/lyYvIxWE90UOrxX1cBVmTyQF2L2ZjMiVW7s8GEdflzvXs1InNi1a5apfqB6hLTiMzqV51YbaEYS527tbPyDFLzErPPK7OkdoZyverd4VxSmb+bZ+asXd1uziQTlvTKfrkpUxHITqtCqukhTTN/jlQoEG2du4fDwPi788RMc8RJTPqWeAoKwa2YJxq3u/HXaDLJa3DME1qlZhPS3aHc5Qj+vl/c5xhaEaKJcTs92xA81s40Of/RIuz+w8cM3RUidkNsNDwm3BSj8Wcbtyma9Ea7nEMhsj7lif6ddHFHBu2f7aeiY67bxNl8M1RpXrT7HEW3Rrfu8NSgQ9T27W1PZIjJN8VXHPyN8RiGx+r/CFjcxw97C/79au/dfGFhYWFh4fD5Bz1JZRno9yjaAAAAAElFTkSuQmCC',
  check: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGaSURBVHhe7dqtTkNBEAXgSiSyshKJRCKRSCQSySPUIZE8ArISiUQikTwCsu4MWbI3WU643d3mksxOzmcq7k6y0/05vUlXKxEREREREREZkZltzOzSzM74WXgA7q0A4InHhAXgrmy+cM1jwwFwBWDPnWdbHh9KOusAvrjrSdoZXBOGma0BfHLTk/zshOtCSI0BeOOmJ3lXnHNdGAB23HQp3QtcEwaAB264FPrcH4i7HwAeuSaMStyl5ndcE0ZD3L1HvvFb4m7NdSG4j7v0zf/n25fruEtvX+WltPTbl+u4SyvOE0qWiiH3cQfghic1STuDx/cYIu4AXPDESseezaHirnI7pxXsup2HizszO22Y8Ibr/uI+7uYstWVdx11N+h1QubReuKbkOu5amdktT7w0F1vu465Hw0r+isch4q4XgGdupDSd5aXuDncabvN9XvlaeviJu161eDzEbdz1qm3xOa7jrlctHtkQcderFo+ToeKuV0M8jhd3vebicdi465Xj8ZWa/xg67o6R/8SwzZ/xV15ERERERESc+wYuF2kHaHmecQAAAABJRU5ErkJggg==',
  video: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAH9SURBVHhe7dkhTwNBEAXgSiQSieQnIJFIJBKJRCJx/QlIJBJZSVBIgkIgkARBKhCI5t6QIXtk87Jtd3MDR9L3JSdadmdmJ7sl2ZtMREREREREREQKABwCuAJwO8LjeY+5plXM7MTMLszsiP/WzBdv/8C6JpjZji8awCvNO+OxTQDc5AHHAmDGtTkA+75LeHzPdxHPaeIBOOgYeCG+zQHc8zjG85pxAwDMC+f0N5455fU6itt8FZ/Ha2qSEscFrFTIW73o3OB6C4UMC1iJ864D4MXMzgE80PfD6uVCBges1HXdY553mXRcfv5DhNcbHrASgLc8bw7AZ/rl3yvMi603PGAl/hFMub+3uZlt8/heeL3hAStxAwB88JiS8HrDA1YqNGDOY0rC6w0PWEkNUAPUADWA8qoBPKYkvN7wgJXUADVADVADKO/GN2AB4NLMdnlsLrze8ICVALzneXN+Q+zX9TzHhdcbHrASgOc8b4nfDwA4ze8HwusND1iJ867ix6U/HjxvcL3hASsV8i7yz8v4dRl9HlZvoZBR3gt0XXeXXoY85d+v47F4TU08AAcdQ74QMzsAcM1jSiIaMOOgYygtJJ35Ke+WXGleE3+7ykFHcs619cxsa9nx8OtzHt8kBfc3LnxG//KZrroKz/XHI83zY1I1T0RERERERGSDfAFUtN1JL4vEgwAAAABJRU5ErkJggg==',
  user: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL9SURBVHhe7ZktbNxAEIUDCwsLAwMDCwsLAwMLCgKDqsCywsDAwpBKkUoKAwsDAwMDA4vuTTXSs+R73rXP9p5vfNpPOp1ON17v7vzu7MlJpVKpVCqVSqWyGGZ2DuDKzL43HwDXAD6q7FHBRb5YDwBeAfwws3f6/GoxszMAf3WxfQB4PgqLoNb/6QJ3xa1Bx1wNvnhd0BQA3OnY4aHZJzUP4N7MPom8B8bb3DNmdtGWD0/K5xngPqtsG27Ec+pZM/ug8iFJmT6j/3uVTeEZAMBjYox7lQ0JtaVsmfwQZnaacYdTlQ2FL1RnPDWImdmXxFhXKheKjPlPyud0hS0rAPBT5ULBKq494TeVGYPGAv+tMqFwDcmEX1RmDEyZ7fHCb8CtTPhVZcawOgvg6U6ZHLn18BQ+FXrF1p4wuVG5XfDgqQP5BqtcKDKR+21sFcdxntrjcKxJGWVRNHBx4qN8V7MJx3hSuZC4tlPVIDPEYDmcWjwZVU0eFACXOnun70DU1zhZZV8g5QoN3IhHXxi/OyfABsaC9bXI3NwB/NEFjYEbMzmNhmBqW+yomqN9/q148ZOLE6vGcziArwB+cZFbn81m8xvAt1Xk+iHcdP08zz7fTppX/DnvJfASZTB9hsBzted7Vn9F8azi6VXfGQLXkh5c9gWLrJsQAZIa79TsS8ANP1y7vKdk3YLXXO4W3i7znmE2r/P/izGxgwXXctbAAudBJ9KGAWx28OKp8HKooKIVZje2GMznfWWrb8yZPlcCHrLu9J0NDLz7OzBR88lARzNfpHhhPdG5OHFYce5FAf7ipNlP7fvPhS7WgRZaNiYw7XQ49EUFs1Cn5ijaO2Qg6jQ4ovTnMn1I51xlJ5G57XlQuUOSSsnFrEC1z0Azqsm5BJqdiswz1Zr2IkXlIpCx1HkxKtPbK+Nbhcm05OcpK3PTUzbFFCThBvNiVeKyc9Zd377RWmXsfUSHhF+FSH05NCXOdgGHTU1vXbs1hDX/hlar/XiaqpVKpVKpVCqVwvwHuccGdQ0huocAAAAASUVORK5CYII=',
  mapPin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAN9SURBVHhe7ZotcNwwEIUDCwsPBgYWFgYGFhYGFgYWlhUWFgYWBh48GBhYWBhYGPbU2c5qxn5+q/H572SPv5kjl7W00q6edn25utrZ2dnZ2VmMlNJ1Suk2pXSfUvqWPwAe/PsP/Mzq8UV/BfCSegDgD4AfAD7yWKsipXQA8MgLPAcAp1Vmhaf1Gy9oKL6R73ie6kgpvQfwxAuYAj9C1zxnNZhzAH6z4xkArx7JT7ZR4vlbP/ulMf5WeSQ88tJxX/gDP1MCwF1hPNuEujIBwJEdNQD8VNHui90ePKbhmzN43Enxu5wdfAPwhW2H4EfDos5zPLHt4vhV11H7qRafsZpAzWN6wraLohTfhIztGF+QVX+WPZbmVgUWrznbVDHXC9sthqmxcOi1tBArgd2mgx+b76XnvTBiLpMF7myLKPX9lpBCybjASZUPNv3IdovA15TV8GyTCSIXYmNFKs8b6dogbWcjpXTTdMIdkWdfnd0+2BXKYxneSbLtZ7abFZuQnTAhYzs7z8EVdszdnqW11wuKGzHmgY1MTNluVlzBmY54ubq3iO7voJ6QFaQfkabdI9vMCgugRZltjKCSk7W8Z0vrro82izVlcSHkPt8dP/SxY5smAJ7J/sQ2hhBgaTcbStiUCNp3bKc2KsM1gopsIIJSMGfD05Wd7WSBt76MFCzrANmQbQvzdsRydpQQshgpxXaH75t23v6q2+KO7NScncxbBI+G6tlbIsc6kPH3BKdgDPv7c3OcQvTDIzU7KsVZub0MlvV/hC+MN1KV3peJfpPgdTc7L1O8QOuIqLbbN3XZElgRZEErfd3OFlFsiOw59XuAuk2iIukiBAuTbapXh/ba3M5//tjLUFnPF6LfqTwvRtCmTvKyInjpUk/0M8rRKAv6MufGTk7g7KhUnWNTZ2VKsTIxFGPVGf3MlIKlrleuDKtEZYG1xWxXIrhaZWtcHZ4FraLn3JJVRZ+Lq6oZ07QE7e46op8Z2rgUnlu+3R1LkAXFd3fBM70ypzr6tsuZQvSLWVM156h5te3uWPooeqF+uHy7O5YgC1rtsqodhlaQVVJqlwvRP7t6rJagUfpf16uGZ1PRz6iFBj+H1d3wDEVlQUC97e5YlNg12Wz0M0rwmqyi3R1LlAVRgbQ5VLvsyBJ5k3DTA+AX22weq/39NwH795jtFD07Ozs7Ozvr4B9AuJ1r0scIfgAAAABJRU5ErkJggg==',
  messageBubble: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABVklEQVR4nO2a0RGCMBBEUwIlUJIlUIIl2AmlUIIlWAIlrDITHWbUyals7jD7vh0vu3ALXJKSEEIIIYQQ4hcA9ACOACYAM7Znzv+91Oi99T7IwkeC4BKjuxEABtLVtrLUHjzFR6GuCcHE36ljQu55z9v+HXOVTHAKPCsjW3zvrdAA7y7Iz+DoHJkGTN7qDExMA0rht+RDR6zfGTJoZtVPBvdp4ldr6EqLYBaXAQUitICrASGQATLAz4DmM6D5p0DzBjTfAiGQATLAz4CPM8Da11EMKH0OfxWAlmT/AOrn8GUHBnAGIsZ5YIQW4IzEdjIPBG0oupN5IGcsvnGPsuBtjHgrM8LbGgu6FbaGuy8YuP/rbI/fXq5O3kpfUO+ABIBDYTGX/Jv/PCJTeAk61xiEuPPmqrYhPr0OwnbEp+cg5B5EiMgqCNsTn1bnAb3XIYQQQgghhNiEK2jCUPuq6aOEAAAAAElFTkSuQmCC',
  home: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMZSURBVHhe7ZmhbxRBFMYrkUgclZWVSCQSiSQoJLICUYckwfAnIJGtaxoEAkEQTQUhpCEBQUhlE5L3PfKSmWT6bnb322Pf7d5lfsmJ2/vmzfc2Ozvf7u3tNRqNRqPRaMyAqh6o6pGqPvS/7TyqeqwFAN6p6h2v2zmsSQDvy+YzAD6r6j0/ZmdQ1f3UZCcAfgF44MduPbbOAVz7hmsAuFHVp77G1gLgeWpqBQAn/lgGwGtfa6tI6/2tbyxjJ8Z0AB51XR0AzlT1rq+9eMx0Mr9CavbW1mdbIoBLrzXS8YNSv2hU9RDAd9+IkW6C+36MkU5adUmkk/bYj1kcZrJnvdv2N3g529r3YzMAXnj9YvDhxnHs9X0AeNJzIpcVmgbCzY0148cwWB6wXOBrGosJTX3hJt0HDv2YMViTAD762sbsoakv3CTTg+udIV1hdtmvMFtoGgg3tvdPvkbtBujnymwsNLHhJopZQ9PYcBPFLKFp3XATxUZD00C4uQTwzI/ZBGk5VHcIY5LQlLa5avMl6+7162LNl/OLyN/ye8H/XQm1WJrCzSd37MSPjcQHL7sSaqHJdH7sKPyZzuHG3wztux8bSW3+jtA0KoJXSXv+GYBXeZupGfDjIuma37Zpe9Ocfrdnk5htscvApph7/tkNzD3/7Abmnn+UAQAvLSwBuDDd0EdEviT9G18rM2b+EFgD1nypG0vXSWDnD4M1AOBHqRuLiPz2NQ12/jBYAwC+lrqxAPjmaxrs/GGwBkTk3OmuTdvzufWoC+CDr2mw84fBGmB1GVbP6sJgDbC6DKtndWGwBlhdhtWzujBYA6wuw+pZXRisAVaXYfWsLgzWAKvLsHpWFwZrgNVlWD2rC4M1wOoyrJ7VhcEaYHUZVs/qwmANsLoMq2d1YbAGWF2G1bO6MCoGujK+z/a9RqPqTo69tCgNsNhLEV+rBMBadUWkt+7kAPjpTTAA+ONrlUTVnRz/xwQLgFNfqySq7uSkPydP0xq9suf2yjq193vn9lLDdCJi/97c97VKyroiciUi1boARtVtNBqNRqPRaDj+AbihmHB9TdLPAAAAAElFTkSuQmCC',
  calendar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHGSURBVHhe7ZpBSkMxFEU7dOiyXILLcOjQmctwCQ47LOIKHDgSF+BAuoLcSEDk8/gt+eZcaOAdyKBtOD1J27SUv9slSZIkSZIASLqptT5Iuo2PEbj9Q/zG/UFHuv3DSHoOgfs4ZwS3fxhJhxB4iHNGcPuHcQe6/cO4A93+s7QDSNJTe9Iz4xgCjytzRsZWf+sdPyjj6Tsbw5sQT9/ZGP62aG+nKJ2J1h/XtIm4AWc+e9+d8/47ev3xrMA3YFUo6W45r9Z6H+eM0Ovv7e2mV1hrvWpRv6/CY631Os4Zodff29sNLjSD9+JCM3gvLjSD9+JCM3gvLjSD964IT33/XspgfweUUt6WwtkopbzHNW1C0leUzkT7BRnXtAlJH1E6E5I+45o2UUp5CcKpzoBSymtc0yaadClst+OcSwLvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvxYVm8F5caAbvXRFO9a9wuy+uaRNNsBTOBrEB+yidCWID4rU5s7F6LVE34dqc2cbJa4mSJEmSJNn9ANQxepaoAtDxAAAAAElFTkSuQmCC',
  bookmark: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVHhe7ZohUgNBEEUjkUgkEolEIpFIJEfIEXBIjpAjICORHAGJREbG/aamarcq1TU7vdnd2RcxryoGdvMeQzeBCptNo9FoNBqNxgQkPUnaSfoCH8n/4tuqk754uyBWPwRJnz6CRNLeN1YljZ+PIEk9vrEq/gAkHTL7WfNxcH78AFYNoP14AO3HA2g/HkD78QDajwfQfjyA9uMBtB8PoP14AO3HA2g/HkD78QDajwfQfjyA9uMBtB8PoP14AO3HA2g/HkD78QDajwfQfjyA9uMBtB8PoP14AO3HA2j/IgFmdm9mb2b26D8XsYR/FnMCzOxK0oe7P73dfu2vHWKOfxGmBpjZraTv03t7JP1KevD35JjqX4wpAWb27N/W9kg6Str6ez1T/ItyTkBu5COilTjHX4WxAaWRT3T/5HT0H0+UVmKsvxpjAkojL+mv/+lvZneSfvw1iaGVGOOvSikgGvnu3pvT5+vu2flre/xKlPyrMBQQjXx63ffPdYqZvY5ZiSH/auQCxo58xJiVyPn981QlE5D9riVyIx8RrYQHP4ACxZGPKK3EKRd3AOeMfERpJXou6gCmjHxEtBLEAex9RMeskY8YWgniALYuYLGRj8itRPq9w19XnSRNJ9+N5qIjH9GtxHvnL/7d0Gg0Go1GI8s/t5Uw8OSpwfYAAAAASUVORK5CYII=',
  chatTab: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANTSURBVHhe7ZotVNxAFIWRlUgksrJyZSUSiaysRCLrKpHISiQSWVmJrKysRNbd13PPudmzuZnMbnbyxzLfORGwL5l5eb8zk7OzSqVSqVQqlRmIiA8R8ZkXgNuI+NZcAL42v1HO732TRMQFgBsAPwD8iQEA+AvgJ4DvEfHRn71qIuKak3elSgDwW15z4fOtArot3XiopY8BwOOqXgSAK7qsT3RKAPxT/lguX8jq9z65FAqJu1yii4hz/XZHK9Pt/TmOPO6TP2tyIuJy3wSlxFVK2UOhcgAech4G4JXj+L2TIeWTsU7XlFdc+n0lqITSM159TKKQ+OL3jc4e5X9NXbJUWh987B2u/Z7RYIz2KU/ruPyUKPF2vEH/G9X7tmTe/PSul0D5oWMQeeLReScJB/OBxCLKNygkOwmSHaTLFgHgxQeZ2+37UOlsoaQ4TrOkUuYDvLjckqgp8jneutxRcDHjD1+k+cigpqwVCvq7PBd4tmWScZk1kPIChofLDQLAxp+4lth3mBB9osVhwCzvD12b+++S8NZHlxmE1uAtXGZNqAfYwkWYywzC44rlxWXWBIAnm2/ZC/Dl7ht4Aa2dKADPLjOIVAhMveApwZfoLOEuM4hUEzTpiquAnipQ1hKznUw89N7l1oC21n2u5Rslvg4Ytc8ekUQF4DxH6QQ7b5bVweWWhGHpEyzuARp6+mxufW1cdglS89Mcy92/QTu6PgA3I85ddk6k/HNibk8uW4QG6uwCKz8skg8yyk+To1j/9XAfkJ4wa2+g/cmO8qR4AZSjZ3HEQbkImeUlcA6+6GkobnwOQSe2HegJ7BGmSo7a/0tancyiPFHsJS3QoNMangzdlCZKHbH3Kk5mU570rA+ysEnRfXvDRNvdVJre1ClvuygnzbdB01dzh6BQ4ccPfrU6uX3IK/a+0FFJWV+T5wFm55BiCmSA+c8jMtbfbpGpVKbOEIqRxVmFyvv7Y+ix/rbjUnka1QsULqw605z3HUrO+ocorhDZKLF57O9elOOLTn5EsRg91ueXXFnFifbp1qPMUDLWz6L9ubKDiTWQsn6Ok1GcDLH+SSne0LMb1OIkFW/wc4FdTlrxhlT8vwvFG5gD9DU3azTL2ftQvFKpVCqVSuXU+Q8Cmh/DZAi8pgAAAABJRU5ErkJggg==',
};

export const BellIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.bell }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

const FIGMA_SHIELD_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPfSURBVHhe7ZpJbhUxEIbDBSDhAAzhABDEmvEAhJALMESsGfdAAgcI0wEYxBqJcc8g7vQZleSOOn/s7nIPLwP9SW/zXtVvl5/tLpd7bm5iYmJiYmLXCCEc0+/+C4CToQZwWm0OLMBaPfgK4L7aHjiAVxp4HWAzhHBE/fY9wIoG2wRwTTX2JSGEM8AXDdDLvh0I4LYncOCsfpcCuK5t7ClCCAvATU/QBvC07g88UpsUwPsQwjJwvO4/KnEarwCr8bNmHQbeeAOuAL7av65tGLb5qX0bwGfbWIF7wI3Yz6vx0//RWrp5NWFaqp/Cprv6dsVmpeoXoYKlAN+AS6rrwQaidIalUF03wGEV8wI8zE31UuL+sg781nacdMsrCnbov8CzOHUXVGdIQgjzpcvS9gPVcQE8SIjdCSEsjh1oDkuXtU9tAHdVx0UqbVWbWeENPPOnbaqeC+CHiqnN2BQEvpVXJH77tF3ViQ4A8EdtxsL7KIyzdF58f6ld/Xc3KmJJjNoMTUHg9njcFniFJUdqrzYuVGTMAbCsLdVxJQZ+Rv3rpHTUxoWKjDEAQwZekdJTGxe25usiQ+4B8Xyxo6M5SlLalK7auLB/fBChGqWBV1hmqVo5Er6dnwKD5QFdA6+wtFw1cyR836qNi1RSUZoBWseB1ypSyKLq5rAyuzoDT9TOhZ39E2KrapfDzgfq3wF38IadPFUghHBR7VwAR1UJ2FC7FMBl9VViUWVDv69RFLxhGaGK9Lp8USVDbVJYTVD9KmxpRZvUEqsoDt4YLAussLKXCgJLaqc01RJi2WqM4He0CbxTuyIy+4DrBkevv5x0Ct4AbqlY77J6COGQihpql6NwEDoHb6hYpFs1qA7wUVVL6vTOQegb/LIK9p7+FcC5hHjRuaBpEIBTal+Kahr2JFK7zgDfEw24Z4GRGoQhgs/VCNWuF6lZYKhdGzEz/AC8sAHR37ugfTJ6b34pMrNgXe1mSSbxKf5jXORmwaBrrQDggvbFAM6r7WAAz7XBSP/HTQGppMewpaW2g6ON1pjJIOSCjyTrhINiqbC2atjVldqOAfBT2464SmaD0HTYKa0ZlJAL3q7H1XZ0rEylHakoqeB4aJr2+rLFTAFeaocqvO8DtNF0VzCTTa+NpsqPDVCf2RBfm0uyJ4KvaFoOhh1V1aeJtjtB4LH67DotG2OFndqyj6q2wI3SwZwpTZtVnfhi05Xos9RSG9xiqPPD6LQtiVJ2+8zRiSHuBOKdYK9iya5j7xqlbpmasMA9xdd9RXzBaUeVuU5cOifU98BhR2s7WcbiiF2QHKx/e2JiYmJiYu/zD6xpodN0qwnCAAAAAElFTkSuQmCC';

export const ShieldIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: FIGMA_SHIELD_ICON }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const WarningTriangleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.warning }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.chevronDown }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.chevronRight }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const PlusIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.plus }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const UsersIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.users }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const KeyIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.key }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const ShareIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.share }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const ClockIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.clock }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const CheckmarkIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.check }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const VideoCameraIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.video }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const UserIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.user }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const MapPinIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.mapPin }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const MessageBubbleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.messageBubble }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const HomeIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.home }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

const FIGMA_CALENDAR_ICON =
  'data:image/png;base64,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';

export const CalendarIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: FIGMA_CALENDAR_ICON }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const BookmarkIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: ICON_DATA.bookmark }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

const FIGMA_MESSAGES_ICON =
  'data:image/png;base64,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';

export const ChatTabIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <Image
    source={{ uri: FIGMA_MESSAGES_ICON }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const SearchIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => {
  const circleSize = size * 0.62;
  const stroke = Math.max(1.8, size * 0.09);
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: stroke,
          borderColor: color,
          position: 'absolute',
          top: size * 0.1,
          left: size * 0.1,
        }}
      />
      <View
        style={{
          width: size * 0.36,
          height: stroke,
          backgroundColor: color,
          borderRadius: stroke / 2,
          position: 'absolute',
          bottom: size * 0.18,
          right: size * 0.1,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => (
  <ChevronRightIcon
    size={size}
    color={color}
    style={[{ transform: [{ rotate: '180deg' }] }, style]}
  />
);

export const SettingsIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  style,
}) => {
  const centerSize = size * 0.44;
  const stroke = Math.max(1.5, size * 0.08);
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {[0, 45, 90, 135].map((deg) => (
        <View
          key={deg}
          style={{
            position: 'absolute',
            width: stroke,
            height: size * 0.88,
            backgroundColor: color,
            borderRadius: stroke / 2,
            transform: [{ rotate: `${deg}deg` }],
          }}
        />
      ))}
      <View
        style={{
          width: centerSize,
          height: centerSize,
          borderRadius: centerSize / 2,
          backgroundColor: '#FFFFFF',
          borderWidth: stroke * 1.2,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const FilterIcon: React.FC<IconProps> = ({
  size = 13,
  color = '#64748B',
  style,
}) => {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.42,
          borderRightWidth: size * 0.42,
          borderTopWidth: size * 0.5,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        }}
      />
      <View
        style={{
          width: size * 0.22,
          height: size * 0.38,
          backgroundColor: color,
          marginTop: -1,
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
        }}
      />
    </View>
  );
};

const FIGMA_EDIT_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGUlEQVR4nO2XYQ6DMAhGe3STHcxTeB4WjVlc1lKBj5ZtfInZP3hvxdaWkslkMplfDBE9iGjdf2eziHPCX/M9EhX4PetsrltpwOMEiGiBFKrXbsFjRuhaDUL8Xnsc/BnYSnBj4wV/CHAPAB6z6zDL2k0E+MUiwK2EOzxCYCp8Q4Cd+zvvwDD4loCx3jj4AhYYDl+AAu6fB0xjs4D7CdtpbhJwP2FvAKgFJDPv9oGoFRDCvxJCQPrPa1fYRUC6VYYS0OzzYQS0h1QkgU0KH0ZACx9CoAK/SQ6oqQI1eGT9EQIm+AgCmwW+Vx8Sy41M8AwV8E4K1CSGBQ7fkUDNvS88I6G9H38I4GnbzSFNp8BfmkNeNLdrZCbzh3kCrg6HzROuUYMAAAAASUVORK5CYII=';

export const EditIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#64748B',
  style,
}) => (
  <Image
    source={{ uri: FIGMA_EDIT_ICON }}
    style={[
      styles.icon,
      {
        width: size,
        height: size,
        tintColor: color,
      },
      style,
    ]}
    resizeMode="contain"
  />
);

export const MoreVerticalIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#64748B',
  style,
}) => {
  const dot = Math.max(2.5, size * 0.16);
  return (
    <View
      style={[
        {
          width: dot + 2,
          height: size,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 1,
        },
        style,
      ]}
    >
      <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
      <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
      <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
    </View>
  );
};

export const CloseIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#64748B',
  style,
}) => {
  const stroke = Math.max(1.8, size * 0.12);
  const arm = size * 0.88;
  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      <View
        style={{
          position: 'absolute',
          width: arm,
          height: stroke,
          backgroundColor: color,
          borderRadius: stroke / 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: arm,
          height: stroke,
          backgroundColor: color,
          borderRadius: stroke / 2,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

export const UploadIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#D97706',
  style,
}) => {
  const stroke = Math.max(1.8, size * 0.1);
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View
        style={{
          position: 'absolute',
          top: size * 0.12,
          width: stroke,
          height: size * 0.52,
          backgroundColor: color,
          borderRadius: stroke / 2,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.15,
          left: size * 0.28,
          width: stroke,
          height: size * 0.3,
          backgroundColor: color,
          borderRadius: stroke / 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.15,
          right: size * 0.28,
          width: stroke,
          height: size * 0.3,
          backgroundColor: color,
          borderRadius: stroke / 2,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.12,
          width: size * 0.78,
          height: size * 0.3,
          borderBottomWidth: stroke,
          borderLeftWidth: stroke,
          borderRightWidth: stroke,
          borderColor: color,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
        }}
      />
    </View>
  );
};

export const BriefcaseIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#FFFFFF',
  style,
}) => {
  const stroke = Math.max(1.5, size * 0.09);
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View
        style={{
          width: size * 0.4,
          height: size * 0.2,
          borderTopWidth: stroke,
          borderLeftWidth: stroke,
          borderRightWidth: stroke,
          borderColor: color,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: size * 0.85,
          height: size * 0.55,
          borderWidth: stroke,
          borderColor: color,
          borderRadius: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: '100%', height: stroke * 0.7, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const RefreshIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#94A3B8',
  style,
}) => {
  const stroke = Math.max(1.4, size * 0.1);
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View
        style={{
          width: size * 0.75,
          height: size * 0.75,
          borderRadius: (size * 0.75) / 2,
          borderWidth: stroke,
          borderTopColor: 'transparent',
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.08,
          right: size * 0.08,
          width: stroke * 2.2,
          height: stroke * 2.2,
          borderTopWidth: stroke,
          borderRightWidth: stroke,
          borderColor: color,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
