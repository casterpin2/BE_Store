import { PagingModel } from '../../../constant/response.constant';
import { Auth } from '../../../jwt/auth';
import { ProductModel } from '../../entities/product.model';
import { ProductService } from '../../service/product.service';

const productService = new ProductService();
const auth = new Auth();
describe('Product Service Test', () => {
  const product = { name: 'Product11', price: 100 } as ProductModel;

  it('create successfully', async () => {
    const result = await productService.create(product);

    expect(typeof result.data === 'object').toBeTrue();
  });
  it('Get All Product', async () => {
    const result = await productService.getAll({
      pageNo: 1,
      pageSize: 20,
    } as PagingModel);
    expect(result.data.items.length).toBeGreaterThan(0);
  });
  it('update successfully', async () => {
    const productData = await productService.getAll({
      pageNo: 1,
      pageSize: 20,
    } as PagingModel);

    const objectProduct = productData.data.items[0] as ProductModel;
    objectProduct.name = 'Test Update Product';
    objectProduct.price = 20;

    const result = await productService.update(objectProduct);
    expect(result.status).toEqual(200);
  });
});
