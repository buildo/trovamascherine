package trovamascherine.service

import java.util.UUID

import scala.concurrent.{ExecutionContext, Future}

import cats.data.EitherT
import cats.instances.future._

import trovamascherine.repository.{AuthRepository, SupplierRepository}
import trovamascherine.model._

trait SupplierService {
  def list(): Future[Either[String, List[Supplier]]]
  def listInBoundingBox(
    minLongitude: Double,
    minLatitude: Double,
    maxLongitude: Double,
    maxLatitude: Double,
  ): Future[Either[String, List[Supplier]]]
  def read(
    supplierId: UUID,
  ): Future[Either[String, Option[Supplier]]]
  def readByToken(
    token: String,
  ): Future[Either[String, Option[Supplier]]]
  def update(
    token: String,
    data: List[Supply],
  ): Future[Either[String, Unit]]
  def acceptTerms(token: String): Future[Either[String, Unit]]
}

object SupplierService {
  def create(
    authRepo: AuthRepository,
    supplierRepo: SupplierRepository,
  )(implicit ec: ExecutionContext): SupplierService =
    new SupplierService {
      override def list(): Future[Either[String, List[Supplier]]] =
        supplierRepo.list()

      override def listInBoundingBox(
        minLongitude: Double,
        minLatitude: Double,
        maxLongitude: Double,
        maxLatitude: Double,
      ): Future[Either[String, List[Supplier]]] =
        supplierRepo.listInBoundingBox(minLongitude, minLatitude, maxLongitude, maxLatitude)

      override def read(
        supplierId: UUID,
      ): Future[Either[String, Option[Supplier]]] =
        supplierRepo.read(supplierId)

      override def readByToken(
        token: String,
      ): Future[Either[String, Option[Supplier]]] = {
        (for {
          maybeSupplierId <- EitherT(
            authRepo.getSupplierId(token),
          )
          supplierId <- EitherT.fromEither(
            maybeSupplierId.toRight(
              "Invalid token",
            ),
          )
          data <- EitherT(supplierRepo.read(supplierId))
        } yield data).value
      }

      private def checkNoDuplicateSupplies(
        supplies: List[Supply],
      ): EitherT[Future, String, Unit] = {
        val goods = supplies.map(_.good)
        if (goods.distinct.length == goods.length)
          EitherT.rightT(())
        else
          EitherT.leftT("Duplicate goods found in supplies")
      }

      override def update(
        token: String,
        data: List[Supply],
      ): Future[Either[String, Unit]] = {
        (for {
          _ <- checkNoDuplicateSupplies(data)
          maybeSupplierId <- EitherT(
            authRepo.getSupplierId(token),
          )
          supplierId <- EitherT.fromEither(
            maybeSupplierId.toRight(
              "Invalid token",
            ),
          )
          supplier <- EitherT(supplierRepo.read(supplierId))
          _ <- EitherT.fromEither(
            supplier.flatMap(_.termsAcceptedOn).toRight("Terms and conditions not accepted"),
          )
          _ <- EitherT.fromEither(
            supplier.flatMap(_.privacyPolicyAcceptedOn).toRight("Privacy policy not accepted"),
          )
          result <- EitherT(supplierRepo.update(supplierId, data))
        } yield result).value
      }
      override def acceptTerms(token: String): Future[Either[String, Unit]] = {
        (for {
          maybeSupplierId <- EitherT(
            authRepo.getSupplierId(token),
          )
          supplierId <- EitherT.fromEither(
            maybeSupplierId.toRight(
              "Invalid token",
            ),
          )
          _ <- EitherT(supplierRepo.acceptTerms(supplierId))
        } yield ()).value
      }

    }
}
