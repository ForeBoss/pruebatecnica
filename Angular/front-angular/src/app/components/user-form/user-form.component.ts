import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ExpressService } from '../../services/express.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  users: User[] = [];
  form: FormGroup;
  isEditing = false;
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private expressService: ExpressService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.sort((a, b) => a.id - b.id);
      this.cdRef.detectChanges();
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditing) {
        this.updateUser();
      } else {
        this.createUser();
      }
    }
  }

  createUser(): void {
    this.userService.createUser(this.form.value).subscribe(() => {
      this.form.reset();
      this.isEditing = false;
      this.loadUsers();
      this.expressService.refreshData();

      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: 'El usuario ha sido agregado exitosamente.',
      });
    });
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    const updatedUser = { ...this.selectedUser, ...this.form.value };

    this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
      () => {
        const index = this.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          this.users[index] = updatedUser;
        }

        this.isEditing = false;
        this.form.reset();
        this.selectedUser = null;
        this.expressService.refreshData();

        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'Los datos del usuario han sido modificados correctamente.',
        });
      },
      (error) => {
        console.error('Error actualizando usuario:', error);
      }
    );
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.selectedUser = user;
    this.form.setValue({
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      edad: user.edad,
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(() => {
          this.loadUsers();
          this.expressService.refreshData();
          this.cdRef.detectChanges();

          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'El usuario ha sido eliminado correctamente.',
          });
        });
      }
    });
  }

  updateJsonData(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.sort((a, b) => a.id - b.id);

      this.expressService.getDataSortedById().subscribe((updatedData) => {
        this.users = updatedData;
        this.cdRef.detectChanges();
      });
    });
  }
}
