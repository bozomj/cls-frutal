para armazenamento utilizar firebase: mais barato

X mostrar carregando imagem no cadastro do post;

X colocar uma parte da descricao dos postes em produtos

X cadastrar com nome de usuario tudo minusculo

X separar os dados de <Produtos /> deixar apenas a funcao de renderizar os dados

X separar a parte de renderizar os card de produtos usado em <Produtos />

#resetar paginationContext quando clicar em link que muda pagina

X adicionar editar em /post/[id] - precisa criar campo em post updated_at.
[ criei um prompt pra editar campo por campo ]

X implementado api emulador firebase

X cadastro de categorias.

X criar end point para retornar usuario logado api/v1/user

x adicionar setas de navegação de imagens na pagina do post

- terminar a pagina perfil
  X colocando preview pra ver a imagem selecionada pra perfil

x botao de adicionar foto na pagina de produto

- (falta impedir que um post seja alterado por outro usuario, no caso das imagens ou colocamos o id do usuario na tabela tbm ou antes de salvar verificar se o post pertence ao usuario atual)

- criar miniatura para visualizar

- criar painel de controle do administrador master

x criar cadastro para as fotos do carrosel (possiveis propagandas para o site)

x redirecionar pagina ao cadastrar usuario

x carrossel criar botoes pra navegar entre os banner

x consertar bug de uma imagem no carrossel;

x precisa listar todas imagems do perfil e suas ações de deletar e alterar a principal
x mudar imagem de perfil das ja cadastradas.

x mudar ImageCropper para conter os botoes de confirmar e cancelar, confirmar retorna a imagem cortada;

- usar url state para paginação

- melhorar funcoes de query no banco para trazer apenas dados que sera usado.

usuarios [
diego@hotmail.com
matheus@hotmail.com | senha 12345
]

META TAGS Open Graph - HTML

// exemplo de busca mais avancada

```sql
  SELECT *,
  ts_rank(to_tsvector('portuguese', titulo || ' ' || descricao),
          websearch_to_tsquery('portuguese', $1)) AS rank
FROM anuncios
WHERE to_tsvector('portuguese', titulo || ' ' || descricao)
      @@ websearch_to_tsquery('portuguese', $1)
ORDER BY rank DESC;

```
