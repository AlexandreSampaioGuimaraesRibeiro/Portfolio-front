import { Badge, Group } from '@mantine/core'
import TelaGame from './TelaGame'

// Troque pelo que você realmente usa
const inventario = [
  { categoria: 'linguagens', itens: ['Java', 'JavaScript', 'PHP', 'SQL'] },
  { categoria: 'frameworks', itens: ['React', 'Mantine', 'Spring Boot', 'Laravel'] },
  { categoria: 'ferramentas', itens: ['Git e GitHub', 'Vite', 'ESLint', 'Docker'] },
]

export default function Habilidades({ onVoltar }) {
  return (
    <TelaGame titulo="Habilidades" fase="03" onVoltar={onVoltar}>
      <div className="jogo-grade">
        {inventario.map((grupo, i) => (
          <section key={grupo.categoria} className={`jogo-cartao ${i % 2 ? 'vermelho' : ''}`}>
            <p className="jogo-etiqueta">{grupo.categoria}</p>
            <Group gap="xs">
              {grupo.itens.map((item) => (
                <Badge key={item} variant="outline" color="gray" size="lg" radius={0} tt="none">{item}</Badge>
              ))}
            </Group>
          </section>
        ))}
      </div>
    </TelaGame>
  )
}